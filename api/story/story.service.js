import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 3
const collectionName = 'story'

export const storyService = {
	remove,
	query,
	getById,
	add,
	update,
	addStoryComment,
	addLikeStory,
}

async function query(filterBy = { txt: '' }) {
	// delete filterBy.random //just for dev
	try {
		let stories
		const criteria = _buildCriteria(filterBy)
		const sort = _buildSort(filterBy)
		const collection = await dbService.getCollection(collectionName)
		if (filterBy.random) {
			console.log('inside random' )
			const pipeline = [
				{ $match: criteria },
				{ $addFields: { rand: { $rand: {} } } },
				{ $sort: { rand: 1 } }
			]

			if (filterBy.pageIdx !== undefined) {
				pipeline.push({ $skip: filterBy.pageIdx * PAGE_SIZE })
				pipeline.push({ $limit: PAGE_SIZE })
			}
			stories = await collection.aggregate(pipeline).toArray()
		}
		else {
			var storyCursor = collection.find(criteria, { sort })
			if (filterBy.pageIdx !== undefined) {
				storyCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
			}
			stories = await storyCursor.toArray()
		}
		return stories
	} catch (err) {
		logger.error('cannot find storys', err)
		throw err
	}
}

async function getById(storyId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(storyId) }

		const collection = await dbService.getCollection(collectionName)
		const story = await collection.findOne(criteria)

		// story.createdAt = story._id.getTimestamp()
		return story
	} catch (err) {
		logger.error(`while finding story ${storyId}`, err)
		throw err
	}
}

async function remove(storyId) {
	const { loggedinUser } = asyncLocalStorage.getStore()
	const { _id: ownerId, isAdmin } = loggedinUser

	try {
		const criteria = {
			_id: ObjectId.createFromHexString(storyId),
		}
		// if (!isAdmin) criteria['owner._id'] = ownerId

		const collection = await dbService.getCollection(collectionName)
		const res = await collection.deleteOne(criteria)

		if (res.deletedCount === 0) throw ('Not your story')
		return storyId
	} catch (err) {
		logger.error(`cannot remove story ${storyId}`, err)
		throw err
	}
}

async function add(story) {
	try {
		story.loc = story.loc ? story.loc : { name: 'Tel Aviv' }
		story.comments = []
		story.likedBy = []
		story.tags = ['music', 'festival', 'friends']
		const collection = await dbService.getCollection(collectionName)
		await collection.insertOne(story)

		return story
	} catch (err) {
		logger.error('cannot insert story', err)
		throw err
	}
}

async function update(story) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(story._id) }
		
		const collection = await dbService.getCollection(collectionName)
		const {_id, ...storyDate} = story
		await collection.updateOne(criteria, { $set: storyDate })
		return story
	} catch (err) {
		logger.error(`cannot update story ${story._id}`, err)
		throw err
	}
}



async function addStoryComment(storyId, comment) {
	try {
		comment.id = makeId()
		comment.createdAt = Date.now()
		const criteria = { _id: ObjectId.createFromHexString(storyId) }
		const collection = await dbService.getCollection(collectionName)
		const updatedDoc = await collection.findOneAndUpdate(
			criteria,
			{ $push: { comments: comment } },
			{ returnDocument: "after" }
		)
		return updatedDoc.comments[updatedDoc.comments.length - 1]
	} catch (err) {
		logger.error(`cannot add comment ${story._id}`, err)
		throw err
	}
}

async function addLikeStory(user, storyId) {
	const miniUser = {
		_id: user._id,
		fullname: user.fullname,
		imgUrl: user.imgUrl
	}
	const collection = await dbService.getCollection(collectionName)
	const story = await collection.findOne({ _id: ObjectId.createFromHexString(storyId), 'likedBy._id': user._id })
	let update
	if (story) {
		update = { $pull: { likedBy: { _id: user._id } } }
	} else {
		update = { $addToSet: { likedBy: miniUser } }

	}
	const updated = await collection.findOneAndUpdate(
		{ _id: ObjectId.createFromHexString(storyId) },
		update,
		{ returnDocument: 'after' }
	)
	return updated
}

async function addStoryMsg(storyId, msg) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(storyId) }
		msg.id = makeId()

		const collection = await dbService.getCollection(collectionName)
		await collection.updateOne(criteria, { $push: { msgs: msg } })

		return msg
	} catch (err) {
		logger.error(`cannot add story msg ${storyId}`, err)
		throw err
	}
}

async function removeStoryMsg(storyId, msgId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(storyId) }

		const collection = await dbService.getCollection(collectionName)
		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId } } })

		return msgId
	} catch (err) {
		logger.error(`cannot remove story msg ${storyId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {}
	if (filterBy.txt) criteria.txt = { $regex: filterBy.txt, $options: 'i' }
	if (filterBy.userId) criteria['by._id'] = filterBy.userId
	return criteria
}

function _buildSort(filterBy) {

	if (filterBy.random) { return { $rand: {} } }
	if (!filterBy.sortField) return {}
	return { [filterBy.sortField]: filterBy.sortDir }
}
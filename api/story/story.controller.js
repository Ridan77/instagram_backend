import { logger } from '../../services/logger.service.js'
import { storyService } from './story.service.js'

export async function getStories(req, res) {
	try {
		const filterBy = {
			txt: req.query.txt || '',
			userId: req.query.userId || '',
			random: req.query.random
			// minSpeed: +req.query.minSpeed || 0,
			// sortField: req.query.sortField || '',
			// sortDir: req.query.sortDir || 1,
			// pageIdx: req.query.pageIdx,
		}
		console.log('filterBy', filterBy)
		const stories = await storyService.query(filterBy)
		res.json(stories)
	} catch (err) {
		logger.error('Failed to get storys', err)
		res.status(400).send({ err: 'Failed to get storys' })
	}
}

export async function getStoryById(req, res) {
	try {
		const storyId = req.params.id
		const story = await storyService.getById(storyId)
		res.json(story)
	} catch (err) {
		logger.error('Failed to get story', err)
		res.status(400).send({ err: 'Failed to get story' })
	}
}

export async function addStory(req, res) {
	const { loggedinUser, body: story } = req
	try {
		const { _id, fullname, imgUrl } = loggedinUser
		story.by = { _id, fullname, imgUrl }
		story.createdAt = Date.now()
		const addedStory = await storyService.add(story)
		res.json(addedStory)
	} catch (err) {
		logger.error('Failed to add story', err)
		res.status(400).send({ err: 'Failed to add story' })
	}
}

export async function updateStory(req, res) {
	const { loggedinUser, body: story } = req
	const { _id: userId } = loggedinUser
	if (story.by._id !== userId) {
		res.status(403).send('Not your story...')
		return
	}

	try {
		const updatedStory = await storyService.update(story)
		res.json(updatedStory)
	} catch (err) {
		logger.error('Failed to update story', err)
		res.status(400).send({ err: 'Failed to update story' })
	}
}

export async function removeStory(req, res) {
	const { loggedinUser } = req
	const storyId = req.params.id
	try {
		const story = await storyService.getById(storyId)
		console.log('story',story);
		
		if (story.by._id !== loggedinUser._id ) {
			res.status(403).send('Not your story to remove...')
			return
		}
		const removedId = await storyService.remove(storyId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove story', err)
		res.status(400).send({ err: 'Failed to remove story' })
	}
}


export async function addStoryComment(req, res) {
	try {
		const { loggedinUser } = req
		const storyId = req.params.storyId
		const { _id, fullname, imgUrl } = loggedinUser
		const comment = {
			txt: req.body.txt,
			by: { _id, fullname, imgUrl },
		}
		const savedComment = await storyService.addStoryComment(storyId, comment)
		res.send(savedComment)
	} catch (err) {
		logger.error('Failed to add comment', err)
		res.status(400).send({ err: 'Failed to add comment' })
	}

}

export async function addLikeStory(req, res) {
	try {
		const storyId = req.params.storyId
		const { loggedinUser } = req
		const savedStory = await storyService.addLikeStory(loggedinUser, storyId)
		res.send(savedStory)
	} catch (err) {
		logger.error('Failed to add like', err)
		res.status(400).send({ err: 'Failed to add like' })
	}



}






// export async function addStoryMsg(req, res) {
// 	const { loggedinUser } = req

// 	try {
// 		const storyId = req.params.id
// 		const msg = {
// 			txt: req.body.txt,
// 			by: loggedinUser,
// 		}
// 		const savedMsg = await storyService.addStoryMsg(storyId, msg)
// 		res.json(savedMsg)
// 	} catch (err) {
// 		logger.error('Failed to add story msg', err)
// 		res.status(400).send({ err: 'Failed to add story msg' })
// 	}
// }

export async function removeStoryMsg(req, res) {
	try {
		const { id: storyId, msgId } = req.params

		const removedId = await storyService.removeStoryMsg(storyId, msgId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove story msg', err)
		res.status(400).send({ err: 'Failed to remove story msg' })
	}
}

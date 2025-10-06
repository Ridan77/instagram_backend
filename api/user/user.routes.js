import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'

import { getUser, getUsers, deleteUser, updateUser,userLike,toggleFollow,toggleSave } from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', requireAuth, updateUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)
router.post('/like/:storyId',requireAuth,userLike)
router.get('/follow/:userToFollowId',requireAuth,toggleFollow)
router.get('/save/:storyIdToSave',requireAuth,toggleSave)

export const userRoutes = router
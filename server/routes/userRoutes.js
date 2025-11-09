import { Router } from 'express'
import { authRequired } from '../middleware/authMiddleware.js'
import { getMe, updateMe, getMyPosts, getMyEvents } from '../controllers/userController.js'

const router = Router()

router.get('/me', authRequired, getMe)
router.put('/update', authRequired, updateMe)
router.get('/me/posts', authRequired, getMyPosts)
router.get('/me/events', authRequired, getMyEvents)

export default router

import { Router } from 'express'
import { authRequired } from '../middleware/authMiddleware.js'
import { createThread, getThread, likeThread, listThreads, replyThread, dislikeThread, deleteThread } from '../controllers/techtalkController.js'

const router = Router()

router.get('/', listThreads)
router.post('/', authRequired, createThread)
router.get('/:id', getThread)
router.post('/:id/reply', authRequired, replyThread)
router.patch('/:id/like', authRequired, likeThread)
router.patch('/:id/dislike', authRequired, dislikeThread)
router.delete('/:id', authRequired, deleteThread)

export default router

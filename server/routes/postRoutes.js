import { Router } from 'express'
import { authRequired } from '../middleware/authMiddleware.js'
import { createPost, dislikePost, getPosts, likePost, commentPost } from '../controllers/postController.js'

const router = Router()

router.get('/', getPosts)
router.post('/', authRequired, createPost)
router.patch('/:id/like', authRequired, likePost)
router.patch('/:id/dislike', authRequired, dislikePost)
router.post('/:id/comment', authRequired, commentPost)

export default router

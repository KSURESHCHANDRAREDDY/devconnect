import { Router } from 'express'
import { authRequired } from '../middleware/authMiddleware.js'
import { createEvent, joinEvent, listEvents, userJoinedEvents } from '../controllers/eventController.js'

const router = Router()

router.get('/', listEvents)
router.post('/', authRequired, createEvent)
router.post('/join/:id', authRequired, joinEvent)
router.get('/user', authRequired, userJoinedEvents)

export default router

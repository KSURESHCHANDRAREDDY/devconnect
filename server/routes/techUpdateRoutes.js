import { Router } from 'express'
import { getTechUpdates } from '../controllers/techUpdateController.js'

const router = Router()

router.get('/', getTechUpdates)

export default router

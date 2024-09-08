import { Router } from 'express';

//! Import User Controller
import userControllers from '../controllers/users.controllers.js'

const router = Router()

//! Endpoints
router.get('/premium/:uid', userControllers.updateUserRole)

router.post('/reset-password', userControllers.updateUserPassword);


export default router
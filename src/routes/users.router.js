import { Router } from 'express';
import { isAdmin } from '../middleware/auth.js';

//! Import User Controller
import userControllers from '../controllers/users.controllers.js'

const router = Router()

//! Endpoints
router.get('/', isAdmin, userControllers.getAllUsers)

router.get('/premium/:uid', userControllers.updateUserRole)

router.post('/reset-password', userControllers.updateUserPassword);

router.delete('/', userControllers.deleteUsers)


export default router
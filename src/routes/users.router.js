import { Router } from 'express';

//! Import UserService
import { userService } from '../repositories/index.js'

const router = Router()

router.get('/premium/:uid', async(req, res) => {
    let userId = req.params.uid
    let user = await userService.getUserById(userId)
    let role = user.role == 'premium' ? 'user' : 'premium'
    let result = await userService.updateUserRole(userId, role)
    res.status(200).json({ status: "sucess", result: result })
})



export default router
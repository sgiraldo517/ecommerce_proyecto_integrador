import { Router } from 'express';
const router = Router()

//! Import messagesModel
import messagesModel from '../dao/models/messages.model.js'

router.get('/users', (req, res) => {
    res.send('Hello users from router')
})

router.post('/', (req, res) => {
    res.send('Hello users from router')
})

router.put('/', (req, res) => {
    res.send('Hello users from router')
})

router.delete('/', (req, res) => {
    res.send('Hello users from router')
})

export default router
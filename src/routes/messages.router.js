import { Router } from 'express';
const router = Router()

//! Import messagesModel
import messagesModel from '../dao/models/messages.model.js'


router.get('/', async(req, res) => {
    try {
        res.render('chat', {})
    } catch (e) {
        res.status(500).send(e.message);
    }
})

export default router
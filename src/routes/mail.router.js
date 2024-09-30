import { Router } from 'express';
import { transport } from '../utils/mailing.js';
import logger from '../utils/logger.js';
import { generateResetToken } from '../utils/password.js';

//! Import UserService
import { userService } from '../repositories/index.js';

const router = Router()

router.post('/mail', async(req, res) => {
    try {
    let { email } = req.body
    const resetToken = generateResetToken(); 
    const resetLink = `http://localhost:8080/newpassword?token=${resetToken}&email=${email}`;

    let result = await transport.sendMail({
        from: 'Coder Ecommerce <s.giraldo517@gmail.com>',
        to: `${email}`,
        subject: 'Restablecer contraseña',
        html: `
        <div>
            <h1>Restablecer contraseña</h1>
            <p>Pulsa el siguiente boton para restablecer la contraseña</p>
            <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Restablecer Contraseña</a>
        </div>
        `
    })
    logger.info(`Email for changing password was sent successfully`)
    res.status(200).json({ status: "sucess", payload: result })
    } catch (err) {
        logger.error(`Error attempting to send mail: ${err.message}`)
    }
})

export default router
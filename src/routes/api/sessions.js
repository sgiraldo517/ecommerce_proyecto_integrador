import { Router } from 'express';
import passport from 'passport';
import { userService } from '../../repositories/index.js';
import logger from '../../utils/logger.js';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { createHash, isValidPassword } from '../../utils/password.js';

dotenv.config()

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), async (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.redirect('/login')
});

router.get('/failregister', async (req, res) => {
    logger.error(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()} - Registration failed`);
    res.status(400).json({ status: "error", payload: "Failed to register"} )
})

router.post('/login', passport.authenticate('login', { failureRedirect: 'faillogin'}), async (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    if(!req.user) {
        logger.warn(`${req.method} request to ${req.url} - Invalid credentials`);
        return res.status(400).send({ status: 'error', error: 'Credenciales invalidas'})
    }
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        };
        res.redirect('/current');

    } catch (err) {
        logger.error(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()} - Error: ${err.message}`);
        res.status(500).send('Error al iniciar sesión' + err);
    }
});

router.get('/faillogin', (req, res) => {
    logger.error(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()} - Login failed`);
    res.send({ error: "Login fallido "})
})


router.get('/github', passport.authenticate('github', { scope: ['user.email']}), async(req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect:'/login' }), async (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    req.session.user = req.user;
    res.redirect('/current');
})


router.post('/logout', (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    req.session.destroy((err) => {
        if (err) {
            logger.error(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()} - Error: ${err.message}`);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
});

router.post('/reset-password', async (req, res) => {
    const { token, email, newPassword, confirmPassword } = req.body;
    const secret = process.env.JWT_SECRET;
    logger.info('Token received:', token)
    try {
        const decoded = jwt.verify(token, secret);
        logger.info('Verified token:', decoded)
        if (newPassword !== confirmPassword) {
            logger.error('Passwords do not match')
            return res.status(400).json({ status: "error", message: "Passwords do not match" });
        } 
        const user = await userService.getUserByEmail({ email });
        if (!user) {
            logger.error(`User ${email} does not exist`)
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        if (isValidPassword( user, newPassword)) {
            logger.warn('Invalid password: Password has been used previously');
            return res.status(400).json({ status: "error", message: "Invalid password: Password has been used previously" })
        }
        user.password = createHash(newPassword); 
        await user.save();
        logger.info('Password updated successfully')
        res.redirect('/login')
    } catch (err) {
        logger.error({ message: 'Invalid or expired token' + err.message })
        res.redirect('/reset')
    }
});

export default router;
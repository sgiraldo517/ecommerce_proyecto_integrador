import { Router } from 'express';
import passport from 'passport';
import logger from '../../utils/logger.js';


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
        if(req.user.role != 'admin') { 
        req.user.lastLogin = new Date();
        await req.user.save();
        }
        
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
    req.user.lastLogin = new Date();
    await req.user.save();
    
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

export default router;
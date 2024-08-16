import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.redirect('/login')
});

router.get('/failregister', async (req, res) => {
    res.status(400).send("Failed to register")
})

router.post('/login', passport.authenticate('login', { failureRedirect: 'faillogin'}), async (req, res) => {
    if(!req.user) return res.status(400).send({ status: 'error', error: 'Credenciales invalidas'})
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            rol: req.user.role
        };
        console.log(req.session.user)
        res.redirect('/current');

    } catch (err) {
        res.status(500).send('Error al iniciar sesión' + err);
    }
});

router.get('/faillogin', (req, res) => {
    res.send({ error: "Login fallido "})
})


router.get('/github', passport.authenticate('github', { scope: ['user.email']}), async(req, res) => {})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect:'/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/current');
})


router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

export default router;
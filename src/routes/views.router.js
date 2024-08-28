import { Router } from 'express';
import { userService } from '../repositories/index.js';
import { isAuthenticated, isNotAuthenticated, isUser } from '../middleware/auth.js';
import productsControllers from '../controllers/products.controllers.js'
import cartsControllers from '../controllers/carts.controllers.js'

const router = Router()


router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login')
})

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register')
})

router.get('/current', isAuthenticated, async(req, res) => {
    const currentUser = await userService.getCurrentUser(req.session.user);
    res.render('current', { currentUser });
});

router.get('/products', isAuthenticated, isUser, async (req, res) => {
    const products = await productsControllers.paginateProducts(req, res);
    const currentUser = await userService.getUserByEmail(req.session.user)
    const currentCart = await userService.getUserCarrito(currentUser._id)
    res.render('products',  { products, cartId: currentCart });
});

router.get('/carts', isAuthenticated, isUser, async (req, res) => {
    const carts = await cartsControllers.paginateCart(req, res);
    const currentUser = await userService.getUserByEmail(req.session.user)
    const currentCart = await userService.getUserCarrito(currentUser._id)
    res.render('carts',  { carts, cartId: currentCart} );
});





export default router
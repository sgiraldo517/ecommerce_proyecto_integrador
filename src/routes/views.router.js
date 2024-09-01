import { Router } from 'express';
import { userService } from '../repositories/index.js';
import { isAuthenticated, isNotAuthenticated, isUser, isAdmin } from '../middleware/auth.js';
import logger from '../utils/logger.js'

//! Import Controllers
import productsControllers from '../controllers/products.controllers.js'
import cartsControllers from '../controllers/carts.controllers.js'

const router = Router()

//! Endpoints
router.get('/login', isNotAuthenticated, (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.render('login')
})

router.get('/register', isNotAuthenticated, (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.render('register')
})

router.get('/current', isAuthenticated, async(req, res) => {
    const currentUser = await userService.getCurrentUser(req.session.user);
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()} - user details: req.session.user`);
    res.render('current', { currentUser });
});

router.get('/products', isAuthenticated, isUser, async (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    const products = await productsControllers.paginateProducts(req, res);
    const currentUser = await userService.getUserByEmail(req.session.user)
    const currentCart = await userService.getUserCarrito(currentUser._id)
    res.render('products',  { products, cartId: currentCart });
});

router.get('/addproduct', isAuthenticated, isAdmin, async (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    const productoReciente = await productsControllers.recentlyAdded()
    console.log(productoReciente);
    res.render('addproduct', productoReciente);
});

router.get('/carts', isAuthenticated, isUser, async (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    const carts = await cartsControllers.paginateCart(req, res);
    const currentUser = await userService.getUserByEmail(req.session.user)
    const currentCart = await userService.getUserCarrito(currentUser._id)
    res.render('carts',  { carts, cartId: currentCart} );
});

router.get('/mockingproducts', productsControllers.generateMockingProducts)

router.get('/loggerTest', (req, res) => {
    logger.debug('Test logging debug');
    logger.http('Test logging http');
    logger.info('Test logging info');
    logger.warn('Test logging warn');
    logger.error('Test logging error');
    logger.fatal('Test logging fatal');
    res.status(200).json({status: "success", payload: "Logging test completed" });
});



export default router
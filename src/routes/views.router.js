import { Router } from 'express';
import { userService, productsService } from '../repositories/index.js';
import { isAuthenticated, isNotAuthenticated, isUser, isAdminOrPremium } from '../middleware/auth.js';
import logger from '../utils/logger.js'

//! Import Controllers
import productsControllers from '../controllers/products.controllers.js'
import cartsControllers from '../controllers/carts.controllers.js'
import usersControllers from '../controllers/users.controllers.js';

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

router.get('/current', isAuthenticated, usersControllers.getCurrentUser);

router.get('/products', isAuthenticated, isUser, async (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    const products = await productsControllers.paginateProducts(req, res);
    const currentCart = await usersControllers.getCurrentUserCart(req, res)
    res.render('products',  { products, cartId: currentCart });
});

router.get('/addproduct', isAuthenticated, isAdminOrPremium, async (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    const productoReciente = await productsControllers.recentlyAdded()
    const email = req.session.user.email;
    res.render('addproduct', { productoReciente, email });
});

router.get('/carts', isAuthenticated, isUser, async (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    const carts = await cartsControllers.paginateCart(req, res);
    const currentCart = await usersControllers.getCurrentUserCart(req, res)
    res.render('carts',  { carts, cartId: currentCart} );
});

router.get('/mockingproducts', productsControllers.generateMockingProducts)

router.get('/reset', (req, res) => {
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.render('reset')
})

router.get('/newpassword', (req, res) => {
    const { token, email } = req.query;
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
    res.render('newpassword', { email, token })
})

router.get('/loggerTest', (req, res) => {
    logger.debug('Test logging debug');
    logger.http('Test logging http');
    logger.info('Test logging info');
    logger.warn('Test logging warn');
    logger.error('Test logging error');
    logger.fatal('Test logging fatal');
    res.status(200).json({status: "success", payload: "Logging test completed" });
});

router.get('/admin-prods', isAuthenticated, isAdminOrPremium, async (req, res) => {
    try {
        logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
        if (req.session.user.role == 'premium') {
            logger.info("Current user is Premium")
            const currentUser = await userService.getUserByEmail({email: req.session.user.email});
            if(!currentUser) {
                logger.error("User not found")
            }
            let products = await productsService.findProductsByOwnerId(currentUser._id)
            if(!products) {
                logger.error("Products not found for user " + currentUser)
            }
            logger.info(`Products for user ${req.session.user.email} fetch successfully`)
            res.render('adminprods',  { products } );
        } else {
            let products = await productsControllers.getProducts(req, res);
            logger.info("Products fetch succesfully")
            res.render('adminprods',  { products } );
        }
    } catch (error) {
        logger.error("Error getting products " + error.message)
    }
});


export default router
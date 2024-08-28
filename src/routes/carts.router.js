import { Router } from 'express';
import { isAuthenticated, isUser } from '../middleware/auth.js';
const router = Router()

//! Import Controllers
import cartsControllers from '../controllers/carts.controllers.js';

//! Endpoints
router.post('/', cartsControllers.createCart)

router.post('/:cid/product/:pid', isAuthenticated, isUser, cartsControllers.addProductToCart)

router.get('/:cid', cartsControllers.findCart)

router.get('/:cid/purchase', cartsControllers.endPurchase)


export default router
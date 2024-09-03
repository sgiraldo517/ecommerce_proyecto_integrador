import { Router } from 'express';
import __dirname from '../utils/dirname.js';
import { isAuthenticated, isAdminOrPremium } from '../middleware/auth.js';
const router = Router()

//! Import Controllers
import productsControllers from '../controllers/products.controllers.js';

//! Endpoints

router.get('/', productsControllers.getProducts)

router.get('/:pid', productsControllers.findProductById)

router.post('/', isAuthenticated, isAdminOrPremium, productsControllers.createProduct)

router.put('/:pid', isAuthenticated, isAdminOrPremium, productsControllers.updateProduct)

router.delete('/:pid', isAuthenticated, isAdminOrPremium, productsControllers.deleteProduct)



export default router
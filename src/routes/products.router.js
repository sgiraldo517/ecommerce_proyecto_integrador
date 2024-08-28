import { Router } from 'express';
import __dirname from '../utils.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
const router = Router()

//! Import Controllers
import productsControllers from '../controllers/products.controllers.js';

//! Endpoints

router.get('/', productsControllers.getProducts)

router.get('/:pid', productsControllers.findProductById)

router.post('/', isAuthenticated, isAdmin, productsControllers.createProduct)

router.put('/:pid', isAuthenticated, isAdmin, productsControllers.updateProduct)

router.delete('/:pid', isAuthenticated, isAdmin, productsControllers.deleteProduct)



export default router
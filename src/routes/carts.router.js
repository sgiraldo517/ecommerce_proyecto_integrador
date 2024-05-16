import { Router } from 'express';
import path from 'path';
import __dirname from '../utils.js';
const router = Router()

//! Import clase CartManager
import CartManager from '../dao/cartManager.js';
const productPathFile = path.join(__dirname, 'public', 'carritos.json')
const cartManager = new CartManager(productPathFile)

//! Endpoints
router.post('/', async(req, res) => {
    try {
        await cartManager.addCarrito();
        return res.status(200).send(`El carrito fue creado exitosamente`)
    } catch (e) {
        res.status(500).send("Error al agregar producto: " + e.message);
    }
})

router.get('/:cid', async(req, res) =>{
    try {
        let cartId = parseInt(req.params.cid)
        const carritoBuscado = await cartManager.getCartById(cartId)
        if (!carritoBuscado) {
            res.status(404).send(`Error: El carrito con el id ${cartId} no existe en la base de datos.`);
            return; 
        }
        res.json(carritoBuscado.products);
    } catch (e) {
        res.status(500).send( "Error al encontrar carrito " + e.message);
    }
})

router.post('/:cid/product/:pid', async(req, res) => {
    try {
        let cartId = parseInt(req.params.cid)
        let productId = parseInt(req.params.pid)
        const carritoActualizado = await cartManager.addAlCarrito(productId,cartId);
        return res.status(200).send(carritoActualizado)
    } catch (e) {
        res.status(500).send("Error al agregar producto: " + e.message);
    }
})

export default router
import { Router } from 'express';
import path from 'path';
import __dirname from '../utils.js';
const router = Router()

//! Import clase CartManager
import CartManager from '../dao/cartManager.js';
const productPathFile = path.join(__dirname, 'public', 'carritos.json')
const cartManager = new CartManager(productPathFile)

//! Import cartsModel
import cartsModel from '../dao/models/carts.model.js'

//! Endpoints
router.post('/', async(req, res) => {
    try {
        await cartsModel.create({})
        const lastProduct = await cartsModel.findOne().sort({ _id: -1 })
        return res.status(200).send({result: "success", payload: lastProduct})
    } catch (e) {
        res.status(500).send("Error al agregar producto: " + e.message);
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    try {
        let carrito = await cartsModel.findById(cartId);
        if (!carrito) {
            return res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
        }
        const productIndex = carrito.products.findIndex(p => p.product == productId);
        if (productIndex !== -1) {
            carrito.products[productIndex].quantity++;
        } else {
            carrito.products.push({ product: productId, quantity: 1 });
        }
        carrito = await carrito.save();
        return res.status(200).send({ result: "success", payload: carrito });
    } catch (e) {
        res.status(500).send("Error updating cart: " + e.message);
    }
})

router.get('/:cid', async(req, res) =>{
    try {
        let cartId = req.params.cid
        const carritoBuscado = await cartsModel.findById(cartId);
        if (!carritoBuscado) {
            res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
            return; 
        }
        res.status(200).send( {result: "success", payload: carritoBuscado} )
    } catch (e) {
        res.status(500).send( "Error al encontrar carrito " + e.message);
    }
})

//! Endpoints FileSystem

// * POST
// router.post('/', async(req, res) => {
//     try {
//         await cartManager.addCarrito();
//         return res.status(200).send(`El carrito fue creado exitosamente`)
//     } catch (e) {
//         res.status(500).send("Error al agregar producto: " + e.message);
//     }
// })

// router.post('/:cid/product/:pid', async(req, res) => {
//     try {
//         let cartId = parseInt(req.params.cid)
//         let productId = parseInt(req.params.pid)
//         const carritoActualizado = await cartManager.addAlCarrito(productId,cartId);
//         return res.status(200).send(carritoActualizado)
//     } catch (e) {
//         res.status(500).send("Error al agregar producto: " + e.message);
//     }
// })

// * GET
// router.get('/:cid', async(req, res) =>{
//     try {
//         let cartId = parseInt(req.params.cid)
//         const carritoBuscado = await cartManager.getCartById(cartId)
//         if (!carritoBuscado) {
//             res.status(404).send(`Error: El carrito con el id ${cartId} no existe en la base de datos.`);
//             return; 
//         }
//         res.json(carritoBuscado.products);
//     } catch (e) {
//         res.status(500).send( "Error al encontrar carrito " + e.message);
//     }
// })


export default router
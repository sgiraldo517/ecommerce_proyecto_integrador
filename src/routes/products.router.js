import { Router } from 'express';
import path from 'path';
import __dirname from '../utils.js';
const router = Router()

//! Import clase ProductManager
import ProductManager from '../dao/productManager.js';
const productPathFile = path.join(__dirname, 'public', 'productos.json')
const productManager = new ProductManager(productPathFile)

//! Import productsModel
import productsModel from '../dao/models/products.model.js'

//! Endpoints

router.get('/', async(req, res) => {
    try {
        let productos = await productsModel.find()
        res.status(200).send( {result: "success", payload: productos} )
    } catch (e) {
        res.status(500).send( "Error al consultar productos " + e.message);
    }
})

router.get('/:pid', async(req, res) =>{
    try {
        const productoBuscado = await productsModel.findById(req.params.pid);
        if (!productoBuscado) {
            res.status(404).send(`Error: El producto con el id ${productId} no existe en la base de datos.`);
            return; 
        }
        res.status(200).send( {result: "success", payload: productoBuscado} )
    } catch (e) {
        res.status(500).send( "Error al encontrar producto " + e.message);
    }
})


router.post('/', async(req, res) => {
    try {
        let { title, description, code, price, status, stock, category, thumbnail } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send( {error: "Error: faltan algunas propiedades del producto obligatorias"} );
        }
        let productoCreado = await productsModel.create({ title, description, code, price, status, stock, category, thumbnail });
        return res.status(200).send( {result: "success", payload: productoCreado} )
    } catch (e) {
        res.status(500).send("Error al agregar producto: " + e.message);
    }
})

router.put('/:pid', async(req, res) =>{
    try {
        let productId = req.params.pid
        const newData = req.body;
        const productoActualizado = await productsModel.findByIdAndUpdate(productId, newData)
        const resultado = await productsModel.findById(productId)
        res.status(200).send( {result: "success", payload: resultado} )
    } catch (e) {
        res.status(500).send( "Error al actualizar el producto " + e.message);
    }
})

router.delete('/:pid', async(req, res) =>{
    try {
        let productId = req.params.pid
        const productoEliminado = await productsModel.findByIdAndDelete(productId)
        res.status(200).send( {result: "success", payload: productoEliminado} )
    } catch (e) {
        res.status(500).send( "Error al eliminar el producto " + e.message);
    }
})

//! Endpoints FileSystem

//* GET
// router.get('/', async(req, res) => {
//     try {
//         let limit = parseInt(req.query.limit)
//         const arrayProductos = await productManager.getProducts()
//         if(!limit) {
//             res.json(arrayProductos)
//         } else {
//             const arrayFiltrado = arrayProductos.slice(0, limit)
//             res.json(arrayFiltrado)
//         }
//     } catch (e) {
//         res.status(500).send( "Error al consultar productos " + e.message);
//     }
// })

//* GET by id
// router.get('/:pid', async(req, res) =>{
//     try {
//         let productId = parseInt(req.params.pid)
//         const productoBuscado = await productManager.getProductById(productId)
//         if (!productoBuscado) {
//             res.status(404).send(`Error: El producto con el id ${productId} no existe en la base de datos.`);
//             return; 
//         }
//         res.json(productoBuscado);
//     } catch (e) {
//         res.status(500).send( "Error al encontrar producto " + e.message);
//     }
// })

//* POST
// router.post('/', async(req, res) => {
//     try {
//         const { title, description, code, price, status, stock, category, thumbnail } = req.body;
//         if (!title || !description || !code || !price || !stock || !category) {
//             return res.status(400).send("Error: faltan algunas propiedades del producto obligatorias");
//         }
//         await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);
//         return res.status(200).send(`El producto ${title} fue agregado exitosamente`)
//     } catch (e) {
//         res.status(500).send("Error al agregar producto: " + e.message);
//     }
// })

//* PUT
// router.put('/:pid', async(req, res) =>{
//     try {
//         let productId = parseInt(req.params.pid)
//         const newData = req.body;
//         const productoActualizado = await productManager.updateProduct(productId, newData)
//         res.status(200).send(productoActualizado)
//     } catch (e) {
//         res.status(500).send( "Error al actualizar el producto " + e.message);
//     }
// })

//* DELETE
// router.delete('/:pid', async(req, res) =>{
//     try {
//         let productId = parseInt(req.params.pid)
//         const productoEliminado = await productManager.deleteProduct(productId)
//         res.status(200).send(productoEliminado)
//     } catch (e) {
//         res.status(500).send( "Error al eliminar el producto " + e.message);
//     }
// })


export default router
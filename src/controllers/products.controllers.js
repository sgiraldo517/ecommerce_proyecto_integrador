import { productsService } from "../repositories/index.js";

const getProducts = async (req, res) => {
    try {
        let result = await productsService.getProducts()
        res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        res.status(500).send( "Error al consultar productos " + e.message);
    }
}

const findProductById = async(req, res) =>{
    try {
        let productId = req.params.pid
        let result = await productsService.getProductById(productId);
        if (!result) {
            res.status(404).send(`Error: El producto con el id ${productId} no existe en la base de datos.`);
            return; 
        }
        res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        res.status(500).send( "Error al encontrar producto " + e.message);
    }
}

const createProduct = async (req, res) => {
    try {
        let { title, description, code, price, status, stock, category, thumbnail } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send( {error: "Error: faltan algunas propiedades del producto obligatorias"} );
        }
        let result = await productsService.addProduct({ title, description, code, price, status, stock, category, thumbnail });
        return res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        res.status(500).send("Error al agregar producto: " + e.message);
    }
}


const updateProduct = async(req, res) =>{
    try {
        let productId = req.params.pid
        const newData = req.body;
        productsService.updateProduct(productId, newData)
        let result = await productsService.getProductById(productId)
        res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        res.status(500).send( "Error al actualizar el producto " + e.message);
    }
}

const deleteProduct = async (req, res) => {
    try {
        let productId = req.params.pid
        let result = await productsService.deleteProduct(productId)
        res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        res.status(500).send( "Error al eliminar el producto " + e.message);
    }
}

const paginateProducts = async(req, res) => {
    try {
        let limit = parseInt(req.query.limit) || 9;
        let page = parseInt(req.query.page) || 1;
        let sort = req.query.sort;
        let category = req.query.category;
        let disponibilidad = parseInt(req.query.disponibilidad);

        const query = {};
        const options = { page, limit, lean:true };;

        if (sort) options.sort = { price: sort === 'asc' ? 'asc' : 'desc' };
        if(category) query.category=category
        if(disponibilidad) query.stock= disponibilidad
        
        let productos = productsService.paginateProducts(query, options)
        return productos
    } catch (e) {
        res.status(500).json({ status: 'error', payload: e.message });
    }
}


export default {
    getProducts,
    findProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    paginateProducts
}
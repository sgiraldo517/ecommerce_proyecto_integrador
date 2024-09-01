import { productsService } from "../repositories/index.js";
import { generateProducts } from "../utils.js";
import CustomError from '../services/errors/CustomError.js'
import EErrors from "../services/errors/enums.js";
import { generateProductErrorMessage } from "../services/errors/info.js";
import logger from '../utils/logger.js';

const getProducts = async (req, res) => {
    try {
        let result = await productsService.getProducts()
        logger.info('Fetched all products successfully.');
        res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        logger.error('Error al consultar productos:', e);
        res.status(500).send( "Error al consultar productos " + e.message);
    }
}

const findProductById = async(req, res) =>{
    try {
        let productId = req.params.pid
        let result = await productsService.getProductById(productId);
        if (!result) {
            logger.warn(`Product with id ${productId} not found.`);
            res.status(404).send(`Error: El producto con el id ${productId} no existe en la base de datos.`);
            return; 
        }
        logger.info(`Product with id ${productId} found successfully.`);
        res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        logger.error('Error finding product by ID:', e);
        res.status(500).send( "Error al encontrar producto " + e.message);
    }
}

const createProduct = async (req, res, next) => {
    try {
        let { title, description, code, price, status, stock, category, thumbnail } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            const errorMessage = generateProductErrorMessage(req.body);
            logger.error('Invalid product data provided.')
            CustomError.createError({
                name: 'InvalidProductData',
                cause: new Error(errorMessage),
                message: 'Product data is invalid',
                code: EErrors.INVALID_TYPES_ERROR
            });
        }
        logger.info(`Product created successfully: ${title}`);
        let result = await productsService.addProduct({ title, description, code, price, status, stock, category, thumbnail });
        return res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        logger.error('Error creando producto:', e);
        next(e);
    }
}


const updateProduct = async(req, res) =>{
    try {
        let productId = req.params.pid
        const newData = req.body;
        productsService.updateProduct(productId, newData)
        let result = await productsService.getProductById(productId)
        logger.info(`Product with id ${productId} updated successfully.`);
        res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        logger.error('Error al actualizar el producto:', e);
        res.status(500).send( "Error al actualizar el producto " + e.message);
    }
}

const deleteProduct = async (req, res) => {
    try {
        let productId = req.params.pid
        let result = await productsService.deleteProduct(productId)
        logger.info(`Product with id ${productId} deleted successfully.`);
        res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        logger.error('Error al eliminar el producto:', e);
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
        
        logger.info('Paginated products fetched successfully.');
        let productos = productsService.paginateProducts(query, options)
        return productos
    } catch (e) {
        logger.error('Error paginating products:', e);
        res.status(500).json({ status: 'error', payload: e.message });
    }
}

const recentlyAdded = async (req, res) => {
    try {
        let result = await productsService.getrecentlyadded()
        logger.info('Recently added product fetched successfully.');
        return result
    } catch (error) {
        logger.error('Error fetching recently added product:', error);
    }
}

const generateMockingProducts = async (req, res) => {
    try {
        logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()}`);
        let products = [];
        for (let index = 0; index < 50; index++) {
            products.push(generateProducts());
        }
        return res.status(200).json({ status: 'success', payload: products });
    } catch (e) {
        logger.error('Error generating mock products:', e);
        res.status(500).json({ status: 'error', payload: e.message });
    }
}


export default {
    getProducts,
    findProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    paginateProducts,
    recentlyAdded,
    generateMockingProducts
}
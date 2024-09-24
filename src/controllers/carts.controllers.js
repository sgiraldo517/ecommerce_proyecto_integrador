import logger from '../utils/logger.js';

//! Import Services
import { cartsService } from "../repositories/index.js";
import { userService } from "../repositories/index.js";
import { productsService } from "../repositories/index.js"
import { ticketsService } from "../repositories/index.js";


const createCart = async(req, res) => {
    try {
        let result = await cartsService.addCart()
        return res.status(200).send({result: "success", payload: result})
    } catch (e) {
        logger.error("Error adding product to cart:", e);
        res.status(500).send("Error al agregar producto: " + e.message);
    }
}

const addProductToCart = async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    try {
        let cart = await cartsService.getCartById(cartId);
        if (!cart) {
            logger.warn(`Cart not found for ID: ${cartId}`);
            return res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
        }
        let result = await cartsService.addProductToCart(cart, productId)
        logger.info(`Product ${productId} added successfullyto cart: ${cartId}`)
        return res.redirect(req.get('referer'));
    } catch (e) {
        logger.error("Error updating cart:", e);
        res.status(500).send("Error updating cart: " + e.message);
    }
}

const findCart = async(req, res) =>{
    try {
        let cartId = req.params.cid
        let result = cartsService.getCartById(cartId)
        if (!result) {
            logger.warn(`Cart not found for ID: ${cartId}`);
            res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
            return; 
        }
        res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        logger.error("Error finding cart:", e);
        res.status(500).send( "Error al encontrar carrito " + e.message);
    }
}

const paginateCart = async(req, res) => {
    const currentUser = await userService.getUserByEmail(req.session.user)
    const cartId = await userService.getUserCarrito(currentUser._id);
    if (!cartId) {
        logger.warn("No active cart found for user")
        return res.status(404).json({ status: 'error', message: 'No active cart found for user' });
    }
    try {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        const carritoBuscado = await cartsService.getProductsByCartId(cartId);
        
        if (!carritoBuscado) {
            logger.warn(`Cart not found for ID: ${cartId}`);
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        let productosCarrito = carritoBuscado.products
        const totalPages = Math.ceil(productosCarrito.length / limit)
        const result = {
            status:'success',
            payload: productosCarrito.slice((page - 1) * limit, page * limit),
            totalPages: totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: page,
            hasPrevPage: page > 1? true : false, 
            hasNextPage: Math.ceil(productosCarrito.length / limit) > 1? true : false, 
            prevLink: page > 1 ? `http://localhost:8080/api/carts/${cartId}?page=${page - 1}&limit=${limit}` : null,
            nextLink: page < totalPages ? `http://localhost:8080/api/carts/${cartId}?page=${page + 1}&limit=${limit}` : null,
        };
        return result
    } catch (e) {
        logger.error("Error paginating cart:", e);
        res.status(500).json({ status: 'error', payload: e.message });
    }
}

const endPurchase = async (req, res) => {
    try {
        const currentUser = await userService.getUserByEmail(req.session.user);
        const cartId = await userService.getUserCarrito(currentUser._id);
        const purchaser = currentUser.email

        if (!cartId) {
            logger.warn("Cart not found for purchase");
            res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
            return;
        }

        const productsCart = await cartsService.getProductsByCartId(cartId);
        let amount = 0
        let code = Math.random().toString(36).substring(2, 10)
        let unprocessedProducts = []

        for (const item of productsCart.products) {
            const productId = item.product._id.toString();
            const productCantidad = item.quantity;

            const productsDatabase = await productsService.getProductById(productId);
            const productsStock = productsDatabase.stock;

            if (productsStock >= productCantidad) {
                const newData = { stock: productsStock - productCantidad };
                amount = amount + productCantidad
                await productsService.updateProduct(productId, newData);
                let cart = await cartsService.getCartById(cartId)
                await cartsService.deleteProductFromCart(cart, productId)
            } else {
                logger.info(`Product ID: ${productId} could not be processed due to insufficient stock.`);
                unprocessedProducts.push(productId)
            }
        }

        await ticketsService.createNewTicket({ code: code, amount: amount, purchaser: purchaser })
        if(unprocessedProducts.length > 0) {
            logger.info("Purchase completed with some items unprocessed due to insufficient stock");
            res.status(200).send("<script>alert('Compra completada con algunos items no procesados debido a stock insuficiente.'); window.location.href='/carts';</script>");
        } else {
            logger.info("Purchase completed successfully");
            res.status(200).send("<script>alert('Compra completada exitosamente.'); window.location.href='/carts';</script>");
        }

    } catch (e) {
        logger.error("Error processing purchase:", e);
        res.status(500).send("<script>alert('Error al procesar la compra: " + e.message + "'); window.location.href='/carts';</script>");
    }
};

export default { 
    createCart,
    addProductToCart,
    findCart,
    paginateCart,
    endPurchase
}

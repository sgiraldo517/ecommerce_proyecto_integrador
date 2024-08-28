import { cartsService } from "../repositories/index.js";
import { userService } from "../repositories/index.js";
import { productsService } from "../repositories/index.js"
import { ticketsService } from "../repositories/index.js";

const createCart = async(req, res) => {
    try {
        let result = await cartsService.addCart()
        return res.status(200).send({result: "success", payload: result})
    } catch (e) {
        res.status(500).send("Error al agregar producto: " + e.message);
    }
}

const addProductToCart = async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    try {
        let cart = await cartsService.getCartById(cartId);
        if (!cart) {
            return res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
        }
        let result = await cartsService.addProductToCart(cart, productId)
        return res.status(200).send({ result: "success", payload: result });
    } catch (e) {
        res.status(500).send("Error updating cart: " + e.message);
    }
}

const findCart = async(req, res) =>{
    try {
        let cartId = req.params.cid
        let result = cartsService.getCartById(cartId)
        if (!result) {
            res.status(404).send({ result: "failure", message: "Carrito no encontrado" });
            return; 
        }
        res.status(200).send( {result: "success", payload: result} )
    } catch (e) {
        res.status(500).send( "Error al encontrar carrito " + e.message);
    }
}

const paginateCart = async(req, res) => {
    const currentUser = await userService.getUserByEmail(req.session.user)
    const cartId = await userService.getUserCarrito(currentUser._id);
    if (!cartId) {
        return res.status(404).json({ status: 'error', message: 'No active cart found for user' });
    }
    try {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;

        const carritoBuscado = await cartsService.getProductsByCartId(cartId);
        
        if (!carritoBuscado) {
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
        res.status(500).json({ status: 'error', payload: e.message });
    }
}

const endPurchase = async (req, res) => {
    try {
        const currentUser = await userService.getUserByEmail(req.session.user);
        const cartId = await userService.getUserCarrito(currentUser._id);
        const purchaser = currentUser.email

        if (!cartId) {
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
                unprocessedProducts.push(productId)
            }
        }

        await ticketsService.createNewTicket({ code: code, amount: amount, purchaser: purchaser })
        if(unprocessedProducts.length > 0) {
            res.status(200).json({ result: "success", message: "Some items were not processed due to missing stock " + unprocessedProducts });
        } else {
            res.status(200).json({ result: "success", message: "Purchase completed successfully" });
        }

    } catch (e) {
        res.status(500).send("Error al procesar la compra: " + e.message);
    }
};

export default { 
    createCart,
    addProductToCart,
    findCart,
    paginateCart,
    endPurchase
}

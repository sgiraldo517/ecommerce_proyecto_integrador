//! Import cartsModel
import cartsModel from '../database/models/carts.model.js'

class Carts {
    constructor() {

    }
    addCart = async () => {
        const newCart = await cartsModel.create({})
        return newCart
    }

    getCartById = async (id) => {
        const cartBuscado = await cartsModel.findById(id);
        return cartBuscado
    }

    addProductToCart = async (cart, productId) => {
        const productIndex = cart.products.findIndex(p => p.product == productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        cart = await cart.save();
        return cart
    }

    getProductsByCartId = async (cartId) => {
        const carritoBuscado = await cartsModel.findById(cartId).populate('products.product').lean();
        return carritoBuscado
    }

    removeProductFromCart = async (cart, productId) => {
        const productIndex = cart.products.findIndex(p => p.product == productId);

        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
        } else {
            throw new Error('Product not found in cart');
        }
        cart = await cart.save();
        return;
    };

}

export default Carts
import mongoose from "mongoose";

//! Creacion de coleccion
const cartsCollection = "Carts";
const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: { type: String, required: true },
            quantity: { type: Number, required: true }
        }],
        default: [] 
    }
});

const cartsModel = mongoose.model(cartsCollection, cartSchema)


export default cartsModel
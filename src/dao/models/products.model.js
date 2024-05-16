import mongoose from "mongoose";

//! Creacion de coleccion
const productsCollection = "Products"
const productSchema = new mongoose.Schema({
    title: {type: String, required: true, max: 200},
    description: {type: String, required: true, max: 200},
    code: {type: String, required: true, max:6}, 
    price: {type: Number, required: true, max: 200}, 
    status: {type: Boolean, default: true},
    stock: {type: Number, required: true, max: 200},
    category: {type: String, required: true, max: 200},
    thumbnail: {type: String}
    }
)

const productsModel = mongoose.model(productsCollection, productSchema)


export default productsModel


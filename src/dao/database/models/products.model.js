import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

//! Creacion de coleccion
const productsCollection = "Products"
const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    code: {type: String, required: true}, 
    price: {type: Number, required: true, }, 
    status: {type: Boolean, default: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    thumbnail: {type: String},
    owner: {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            default: null,
        },
        admin: {
            type: Boolean,
            default: false
        }
    }
})

productSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productSchema)


export default productsModel


import mongoose from "mongoose";

//! Creacion de coleccion
const messagesCollection = "Messages"
const messageschema = new mongoose.Schema({
    user: {type: String, required: true, max: 200},
    message: {type: String, required: true, max: 600},
    }
)

const messagesModel = mongoose.model(messagesCollection, messageschema)


export default messagesModel

import mongoose from "mongoose";

//! Creacion de coleccion
const ticketsCollection = "Tickets";
const ticketsSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }, 
});

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);

export default ticketsModel;


import express from 'express';
import path from 'path';
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import { json, urlencoded } from 'express'
import mongoose from 'mongoose'


const app = express()
const PORT = 8080

//! Importar rutas
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'

//* Middleware
app.use(json())
app.use(urlencoded({ extended: true }))

//! Mongoose connection
const environment = async () => { 
    await mongoose.connect("mongodb+srv://sofia:PapasFritas2024@cluster0.s2hghwf.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
        .then(() => {console.log("Conectado a la base de datos");})
        .catch(e =>console.error("Error en la conexion", e))
}

environment()

app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


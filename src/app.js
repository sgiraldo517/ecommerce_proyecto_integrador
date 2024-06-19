import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import session from 'express-session';
import initializePassport  from './config/passport.config.js';
import __dirname from './utils.js'


const app = express()
// const PORT = 8080
// const httpServer = app.listen(PORT, console.log(`Server running on port ${PORT}`));
// const socketServer = new Server(httpServer)

//! Importar rutas
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'
import viewsRouter from './routes/views.router.js'
import sessionsRouter from './routes/api/sessions.js'

//* Inicializacion del motor
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'));

//! Mongoose connection
const environment = async () => { 
    await mongoose.connect("mongodb+srv://sofia:PapasFritas2024@cluster0.s2hghwf.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
        .then(() => {console.log("Conectado a la base de datos");})
        .catch(e =>console.error("Error en la conexion", e))
}
environment()

//* Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://sofia:PapasFritas2024@cluster0.s2hghwf.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0' }),
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
app.use('/', messagesRouter)
app.use('/', viewsRouter)
app.use('/api/sessions', sessionsRouter);

//* Websocket
// socketServer.on('connection', async(socketClient) => {
//     console.log("Cliente conectado") 
// })

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


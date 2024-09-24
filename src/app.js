import express from 'express';
import handlebars from 'express-handlebars'
import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv'
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

import initializePassport  from './config/passport.config.js';
import mongoose from './config/config.js'
import errorHandler from './middleware/errors/index.js'
import logger from './utils/logger.js';
import __dirname from './utils/dirname.js'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

//! Importar rutas
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import sessionsRouter from './routes/api/sessions.js'
import mailRouter from './routes/mail.router.js'
import usersRouter from './routes/users.router.js'

//* Inicializacion del motor
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, '../public')));

//* Middleware
app.use(bodyParser.json())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(errorHandler)

app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
app.use('/', viewsRouter)
app.use('/api/sessions', sessionsRouter);
app.use('/', mailRouter)
app.use('/api/users', usersRouter);

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion Ecommerce',
            description: 'Documentacion detallada del ecommerce construido como proyecto final de BackEnd'
        }
    },
    apis: [`${__dirname}/../docs/**/*.yaml`]
}
const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});


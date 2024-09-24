//! Import Services
import Carts from '../dao/database/carts.database.js'
import Products from '../dao/database/products.database.js'
import Users from '../dao/database/user.database.js'
import Tickets from '../dao/database/tickets.database.js'

//! Import Repositories
import CartsRepositories from '../repositories/carts.repository.js'
import ProductsRepositories from '../repositories/products.repository.js'
import UsersRepositories from '../repositories/user.repository.js'
import ticketsRepositories from '../repositories/tickets.repository.js'


export const cartsService = new CartsRepositories(new Carts())
export const productsService = new ProductsRepositories(new Products())
export const userService = new UsersRepositories(new Users())
export const ticketsService = new ticketsRepositories(new Tickets())

import { createHash } from "../../utils/password.js";
import { cartsService } from "../../repositories/index.js";
//! Import Models
import userModel from '../database/models/user.model.js'
import cartsModel from '../database/models/carts.model.js';

class Users {
    constructor() {

    }

    getUserByEmail = async (email) => {
        const userBuscado = await userModel.findOne(email)
        return userBuscado
    }

    addUser = async (user) => {
        const newCart = await cartsModel.create({})
        const newUser = new userModel({
            ...user,
            carts: [{ cart: newCart._id }]
        });
        await newUser.save();
        return newUser
    }

    createUser = async (user) => {
        let newUser = await userModel.create(user)
        return newUser
    }

    getUserById = async (id) => {
        let user = await userModel.findById(id);
        return user
    }  
    
    getActiveCartByUserId = async (userId) => {
        const user = await userModel.findById(userId);
        const cartid = user.carts[0].cart.toString();
        return cartid
    };

    updateUserRole = async (userId, role) => {
        const updatedProduct = await userModel.findByIdAndUpdate(userId, { role: role })
        return updatedProduct
    }

}

export default Users
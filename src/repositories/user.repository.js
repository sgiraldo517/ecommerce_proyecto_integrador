//! Import DTOs
import UsersDTO from '../dao/DTOs/user.dto.js'
import CurrentDTO from '../dao/DTOs/current.dto.js';


class UserRepositories{
    constructor(dao) {
        this.dao = dao
    }

    getUserByEmail = async (email) => {
        let result = await this.dao.getUserByEmail(email);
        return result
    }

    getUserById = async (id) => {
        let result = await this.dao.getUserById(id)
        return result
    }

    addUser = async ({ first_name, last_name, email, age, password }) => {
        let newUser = new UsersDTO({ first_name: first_name, last_name: last_name, email: email, age: age, password: password })
        let result = await this.dao.addUser(newUser)
        return result
    }

    createUser = async ({ full_name, email }) => {
        let newUser = new UsersDTO({ full_name, email })
        let result = await this.dao.addUser(newUser)
        return result
    }

    getCurrentUser = async (user) => {
        let currentUser = new CurrentDTO(user)
        return currentUser
    }

    getUserCarrito = async (userId) => {
        let result = await this.dao.getActiveCartByUserId(userId)
        return result
    }

    updateUserRole = async (user, role) => {
        let result = await this.dao.updateUserRole(user, role)
        return result
    }

    getAllUsers = async () => {
        let result = await this.dao.getAllUsers()
        return result
    }

    deleteInactiveUsers = async () => {
        let result = await this.dao.deleteInactiveUsers()
        return result
    }

}

export default UserRepositories
//! Import DTOs
import ProductsDTO from '../dao/DTOs/products.dto.js'
import { userService } from "../repositories/index.js";

class ProductsRepositories{
    constructor(dao) {
        this.dao = dao
    }

    getProducts = async () => {
        let result = await this.dao.getProducts();
        return result
    }

    getProductById = async (Id) => {
        let result = await this.dao.getProductById(Id)
        return result
    }

    addProduct = async ({ title, description, code, price, status, stock, category, thumbnail, email }) => {
        const user = await userService.getUserByEmail({ email } )
        const owner = user ? { user: user._id } : { admin: true };
        let newProduct = new ProductsDTO({ title, description, code, price, status, stock, category, thumbnail })
        newProduct.owner = owner
        let result = await this.dao.addProduct(newProduct)
        return result
    }

    updateProduct = async (productId, newData) => {
        let result = await this.dao.updateProduct(productId, newData)
        return result
    }

    deleteProduct = async (productId) => {
        let result = await this.dao.deleteProduct(productId)
        return result
    }

    paginateProducts = async (query, options) => {
        let result = await this.dao.paginateProducts(query, options)
        return result
    }

    getrecentlyadded = async () => {
        let result = await this.dao.getrecentlyadded()
        return result
    }

    findProductsByOwnerId = async (userId) => {
        const result = await this.dao.findProductsByOwnerId(userId);
        return result;
}; 

}

export default ProductsRepositories
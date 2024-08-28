//! Import DTOs
import ProductsDTO from '../dao/DTOs/products.dto.js'

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

    addProduct = async ({ title, description, code, price, status, stock, category, thumbnail }) => {
        let newProduct = new ProductsDTO({ title, description, code, price, status, stock, category, thumbnail })
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

}

export default ProductsRepositories
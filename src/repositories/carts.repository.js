class CartsRepositories{
    constructor(dao) {
        this.dao = dao
    }

    addCart = async () => {
        let result = await this.dao.addCart();
        return result
    }

    getCartById = async (Id) => {
        let result = await this.dao.getCartById(Id)
        return result
    }

    addProductToCart = async (cart, productId) => {
        let result = await this.dao.addProductToCart(cart, productId)
        return result
    }

    getProductsByCartId = async (cartId) => {
        let result = await this.dao.getProductsByCartId(cartId)
        return result
    }

    deleteProductFromCart = async (cart, productId) => {
        let result = await this.dao.removeProductFromCart(cart, productId)
        return result
    }

}

export default CartsRepositories
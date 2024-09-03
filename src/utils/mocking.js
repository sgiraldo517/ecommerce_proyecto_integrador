import { faker } from '@faker-js/faker/locale/es'

//! Implementacion Mocking con faker
export const generateProducts = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(6),
        price: faker.commerce.price(),
        stock: faker.string.numeric(),
        category: faker.commerce.department(),
        thumbnail: faker.image.url(),
    }
}


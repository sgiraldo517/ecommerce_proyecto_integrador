# Ecommerce

## Table of Contents
- [Ecommerce](#ecommerce)
  - [Table of Contents](#table-of-contents)
  - [1. Project Overview](#1-project-overview)
  - [2. Features](#2-features)
  - [3. Tech Stack](#3-tech-stack)
  - [4. Installation](#4-installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [5. API Documentation](#5-api-documentation)
  - [6. Database Structure](#6-database-structure)
  - [7. User Roles \& Permissions](#7-user-roles--permissions)

## 1. Project Overview
Ecommerce platform created to provide users with a simple shopping experience. 

## 2. Features
- See product catalog
- Add products to cart
- User authentication and session management
- Purchase functionality with stock management
- Detailed API documentation with Swagger

## 3. Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** Handlebars, Bootstrap
- **Authentication:** Passport.js
- **API Documentation:** Swagger
- **Other:** bcrypt, dotenv, Winston (logging)

## 4. Installation
### Prerequisites
- Node.js version 20.11.0
- MongoDB

### Steps
1. Clone the repository:  
```bash
   git clone https://github.com/your-repo-link.git
```
2. Install dependencies:
```bash
   npm install
```
3. Set up environment variables:
Create a .env file and configure the following:
```bash
    DATABASE_URL="MongoDBURL"
    ENV="development" or "production"
    JWT_SECRET="JWTSecret"
```
4. Run the application:
```bash
    npm start
```

## 5. API Documentation
This project includes detailed API documentation that can be accessed via Swagger. To view the documentation:

1. Ensure the server is running.
2. Open a browser and go to the following link: [Swagger API Documentation](http://localhost:8080/apidocs/)

## 6. Database Structure
Collections:
- Users: Information such as first name, last name, email, role (user/admin/premium) ans password
- Products: Title, description, price, stock
- Carts: product IDs, quantities
- Tickets: Purchaser details, purchase amount, purchase date
- Sessions: Session data is stored using MongoDB for persistent session management.

## 7. User Roles & Permissions
- **Admin**: Can manage users and products. Only one existant admin user. credentials
> **Credentials**
> User: admin@gmail.com
> Password: admincontraseña

- **Basic Users**: Can browse products, add product to cart, complete purchases and view profile.
- **Premium Users**: Some admin permissions are added such as adding products and deleting created products by same user.



Thanks ❤️

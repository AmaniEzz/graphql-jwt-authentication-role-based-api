# Role-Based GraphQL CRUD API With Node.js and TypeScript

This project aims at demonstrating how to implement a secure GraphQL API that implements JWT Authentication and role based access control.

This is not a full ecommerce API, this project only focuses on the authentication and authorization concept using
a simple `Products service` to showcase how role-based access works and how JWT is used to secure the API.

## Technologies

- Node.js
- Express.js
- TypeScript
- TypeGraphQL
- TypeGoose
- MongoDB
- JSON Web Token
- Apollo GraphQL server

## Features

- A user can signup/login.
- An admin can signup/login.
- Unauthorized users can view a list of all products.
- Unauthorized users can view a single products's public details.
- Only authorized users can view the number of times a product has been purchased.
- Only authorized users can rate a product.
- Only authorized admin can add/edit a product.

---

### Future Features

- Only authorized users can add products to their shopping cart.
- authorized user can only view their own shopping cart.

---

## Requirements

For development, you will only need Node.js and npm installed in your environement.

    $ node --version
    v14.17.5

    $ npm --version
    6.14.14

---

## Setup and Run the project

#### 1) Install dependencies using following command:

    $ npm install

#### 2) Run docker-compose.yml file to setup a mongoDB database:

    $ docker-compose up -d

#### 3) Run the dev environement using the following command:

    $ npm run dev

## API Usages

### Create user

Query

```
mutation signUp($input: CreateUserInput!){
  signUp(input: $input) {
    username
    email
    role
  }
}
```

Create Customer Input

```
{
  "input": {
    "email": "JaneDoe@example.com",
    "name": "Jane Doe",
    "password": "password123"
    "role": customer
  }
}
```

Create Admin Input

```
{
  "input": {
    "email": "admin@example.com",
    "name": "admin",
    "password": "password123admin"
    "role": admin
  }
}
```

### Get current user Query

Query

```
query {
    me {
        id
        email
        role
    }
}
```

### Login Query

Query

```
mutation login($input: LoginInput!){
    login(input: $input)
}
```

Customer Input

```
{
    "input": {
        "email": "JaneDoe@example.com",
        "password": "password123"
    }
}
```

Admin Input

```
{
    "input": {
        "email": "admin@example.com",
        "password": "password123admin"
    }
}
```

### Logout Query

```
mutation {
  logout
}
```

### Create a product

Query

```
mutation createProduct($input: CreateProductInput!){
    createProduct(input: $input){
        id
        name
        quantity
        category
        price {
            amount
            currency
        }
        purchaseCount
        ratings
        averageRating
    }
}
```

input

```
{
    "input: {
        "name": "Solid Gold Chicken Recipe for adult cats",
        "price": {
            "amount": 100,
            "currency": "USD"
        },
        "category": Pets,
        "quantity": 10,
        "description": "blah blah blah blah blah blahblah blah",
    }
}
```

### Get products

Query

```
query {
    getProducts {
        id
        name
        quantity
        category
        price {
            amount
            currency
        }
        purchaseCount
        ratings
    }
}
```

### Get a single product

Query

```
query getProduct($productId: String!) {
    getProduct(productId: $productId) {
        id
        name
        quantity
        category
        price {
            amount
            currency
        }
        purchaseCount
        ratings
    }
}

```

Input

```
{
    "input": {
        "productId": a real id
    }
}
```

### Update a product

Query

```
mutation updateProduct($productId: String!, $input: UpdateProductInput!){
    updateProduct(productId: $productId, input: $input){
        id
        name
        quantity
        category
        price {
            amount
            currency
        }
        purchaseCount
        ratings
        averageRating
    }
}
```

input

```
{
    "input: {
        "name": "New Name",
        "price": {
            "amount": 200,
            "currency": "USD"
        },
        "category": Pets,
        "quantity": 20,
        "description": "blah blah blah blah blah blah",
    }
}
```

### Rate a Product

```
mutation rateProduct($productId: String!, $rate: Number!){
  rateProduct(productId: $productId, rate: $rate){
    ratings
    averageRating
  }
}
```

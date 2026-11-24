# CashFlow API – Personal Expense Tracker

## Project Overview

CashFlow API is a RESTful API built to help users manage and monitor their personal finances by tracking income and expenses.

The application allows users to create accounts, securely log in, and manage their financial transactions. Each user can access only their own transactions through JWT-based authentication.

The API also provides financial summaries, including total income, total expenses, and account balance, using MongoDB aggregation.

This project was developed using Node.js, Express.js, and MongoDB.

## Technologies Used

- **Node.js** – JavaScript runtime environment.
- **Express.js** – Backend web framework for building RESTful APIs.
- **MongoDB** – NoSQL database for storing users and transactions.
- **Mongoose** – Object Data Modeling (ODM) library for MongoDB.
- **bcryptjs** – Password hashing and verification.
- **JSON Web Token (JWT)** – Authentication and authorization.
- **dotenv** – Environment variable management.
- **Postman** – API testing.

## Features

- User registration with name, email, and password.
- Secure password hashing using bcryptjs.
- User login with JWT token generation.
- Protected API routes.
- Create, retrieve, update, and delete transactions.
- Transaction ownership and user data isolation.
- Filter transactions by category, type, and month.
- Sort transactions by date.
- Retrieve total income, expenses, and balance.
- Generate monthly financial summaries.
- MongoDB aggregation for financial calculations.

## Installation and Setup

Follow these steps to run the CashFlow API locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Sarnaan247/cashflow-API.git
```

### 2. Navigate into the Project Directory

```bash
cd cashflow-API
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
JWT_EXPIRES_IN=1d
```

Replace the placeholder values with your own MongoDB connection string and a strong, private JWT secret.

**Important:** Never upload your `.env` file or expose your database credentials and JWT secret.

### 5. Start the Development Server

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

The server connects to MongoDB using the configured connection string.


## API Endpoints

Base URL:

```text
http://localhost:5000/api
```

### Authentication Routes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Log in and receive a JWT | Public |

### Transaction Routes

All transaction routes require a valid JWT access token.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/transactions` | Retrieve all logged-in user's transactions |
| POST | `/transactions` | Create a new transaction |
| GET | `/transactions/:id` | Retrieve a single transaction |
| PUT | `/transactions/:id` | Update a transaction |
| DELETE | `/transactions/:id` | Delete a transaction |
| GET | `/transactions/summary` | Retrieve financial summary |
| GET | `/transactions/summary/monthly?month=YYYY-MM` | Retrieve monthly financial summary |

### Transaction Filtering and Sorting

The API supports filtering and sorting transactions using query parameters.

| Query Parameter | Example | Description |
|---|---|---|
| `category` | `?category=food` | Filter by category |
| `type` | `?type=expense` | Filter by income or expense |
| `month` | `?month=2026-11` | Filter by month |
| `sort` | `?sort=oldest` | Display oldest transactions first |

Filters can also be combined.

Example:

```text
GET /api/transactions?category=food&type=expense
```

### Authentication Header

Protected transaction routes require a JWT token in the Authorization header.

```text
Authorization: Bearer YOUR_JWT_TOKEN
```
## Example Requests

### 1. Register a User

**POST** `/api/auth/register`

Request body:

```json
{
  "name": "kangyang",
  "email": "kang@example.com",
  "password": "StrongPassword123"
}
```

### 2. Login a User

**POST** `/api/auth/login`

Request body:

```json
{
  "email": "kang@example.com",
  "password": "StrongPassword123"
}
```

A successful login returns a JWT token, which must be included in the Authorization header when accessing protected routes.

### 3. Create a Transaction

**POST** `/api/transactions`

Request body:

```json
{
  "title": "Monthly Salary",
  "amount": 300000,
  "type": "income",
  "category": "salary",
  "date": "2026-11-23"
}
```

### 4. Update a Transaction

**PUT** `/api/transactions/:id`

Example request body:

```json
{
  "title": "November Salary",
  "amount": 350000,
  "type": "income",
  "category": "salary"
}
```

### 5. Financial Summary

**GET** `/api/transactions/summary`

Example response:

```json
{
  "message": "Transaction summary retrieved successfully",
  "totalIncome": 300000,
  "totalExpenses": 50000,
  "balance": 250000
}
```

### 6. Monthly Financial Summary

**GET** `/api/transactions/summary/monthly?month=2026-11`

Example response:

```json
{
  "message": "Monthly summary retrieved successfully",
  "month": "2026-11",
  "totalIncome": 300000,
  "totalExpenses": 50000,
  "balance": 250000
}
```## Security and Data Validation

CashFlow API implements several security and validation measures to protect user accounts and financial records.

- Passwords are hashed using bcryptjs before being stored in MongoDB.
- JWT authentication is used to protect transaction endpoints.
- Users can only access and manage transactions belonging to their own accounts.
- Required fields are validated before transactions are created.
- Transaction amounts must be valid numbers greater than zero.
- Transaction types are restricted to `income` and `expense`.
- Transaction categories are validated against the supported categories.
- Environment variables are used to protect sensitive configuration details.

## Database

The application uses MongoDB Atlas to store user accounts and financial transactions.

Mongoose is used to define database schemas, validate records, and perform database operations.

## Author

**Martins**

GitHub: [Sarnaan247](https://github.com/Sarnaan247)
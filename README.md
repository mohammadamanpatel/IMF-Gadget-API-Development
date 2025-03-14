# Upraised Task - Gadget Management API

## 📌 Project Overview
This project, Phoenix: IMF Gadget API, is a secure API designed to manage the Impossible Missions Force (IMF) gadget inventory. Built with Node.js, Express, and PostgreSQL, this API allows Quartermasters to handle gadget lifecycle operations, including adding, updating, decommissioning, and triggering a self-destruct sequence. The API ensures security through JWT-based authentication and role-based authorization while also supporting caching via Redis cache for optimized performance. Additionally, it features a mission success probability generator and status-based gadget filtering. 🚀


## 🛠️ Technologies Used
| Technology    | Purpose |
|--------------|---------|
| **Node.js**  | JavaScript runtime for backend |
| **Express.js** | Web framework for handling API requests |
| **PostgreSQL** | Relational database for storing gadget data |
| **Sequelize** | ORM for interacting with PostgreSQL |
| **JWT (jsonwebtoken)** | Authentication and token verification |
| **bcrypt** | Password hashing for user authentication |
| **Redis (ioredis)** | Caching layer to optimize performance |
| **UUID** | Unique identifier generation for gadgets |
| **Nodemon** | Auto-restart server for development |
| **Cookie-Parser** | Middleware for handling cookies |


## 📂 Folder Structure

| Folder/File               | Description |
|---------------------------|-------------|
| **config/**               | Configuration files |
| ├── `config.cjs`          | App-level configurations |
| **connection_config/**     | Database and Redis connection setup |
| ├── `DB.connect.js`       | PostgreSQL database connection |
| ├── `redisConfig.js`      | Redis client configuration |
| **controllers/**          | Controllers for handling API requests |
| ├── `Auth.controller.js`  | Handles authentication routes |
| ├── `Gadget.controller.js` | Handles gadget-related operations |
| **Jwt_Utils/**            | Utilities for JWT management |
| ├── `Cookie.options.js`   | Cookie options for authentication |
| ├── `Jwt.token.js`        | JWT token generation and verification |
| **middlewares/**          | Middleware for authentication & authorization |
| ├── `AuthN.js`            | Authentication middleware |
| ├── `AuthZ.js`            | Authorization middleware for roles |
| **migrations/**           | Sequelize migration files |
| ├── `20250314110936-create-user.js` | User migration |
| ├── `20250314111041-create-gadget.js` | Gadget migration |
| **models/**               | Database models |
| ├── `Gadget.model.js`     | Gadget model |
| ├── `User.model.js`       | User model |
| ├── `index.js`            | Sequelize model index |
| **Redis_Cache_Handlers/** | Redis caching logic |
| ├── `Redis_handlers.js`   | Functions for caching operations |
| **routes/**               | API route handlers |
| ├── `Auth.routes.js`      | Authentication routes |
| ├── `Gadget.routes.js`    | Gadget management routes |
| `.env`                    | Environment variables |
| `server.js`               | Main server file |
| `README.md`               | Project documentation |


## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/mohammadamanpatel/IMF-Gadget-API-Development
cd IMF-Gadget-API-Development
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables (note:- Neon Tech free-tier is used postgresql database management and upstash redis free-tier is used for redis caching)
Create a `.env` file in the root directory and add the following variables:
```env
PORT = <port>
JWT_SECRET = <jwt-secret>
JWT_EXPIRY = <jwt-expiry>
COOKIE_MAX_AGE = <cookie-max-age>
PGHOST = <pg-host>
PGDATABASE = <pg-database>
PGUSER = <neondb_owner>
PGPASSWORD = <pg-password>
PGPORT = <pg-port>
REDIS_URL = <upstash-redis-url>
REDIS_CACHE_EXPIRY = <redis-cache-expiry>
AUTH_REDIS_CACHE_PREFIX = <auth-redis-cache-prefix>
GADGET_REDIS_CACHE_PREFIX = <gadget-redis-cache-prefix>
```

### 4️⃣ Run Migrations
```sh
npx sequelize-cli db:migrate
```

### 5️⃣ Start the Server
```sh
# For production
npm start

# For development (auto-restart on changes)
npm run dev
```

## **📘 API Documentation**
For a detailed description of the API, including request and response formats, refer to the full **API Documentation** here:  
[📄 API Documentation (Auth endpoints)](https://www.postman.com/joint-operations-cosmologist-64352344/workspace/imf-gadget-endpoints/collection/30730048-ca372182-d5b5-4ee2-8cfb-71aff27641d4?action=share&creator=30730048)

[📄 API Documentation (Gadget endpoints)](https://www.postman.com/joint-operations-cosmologist-64352344/workspace/imf-gadget-endpoints/collection/30730048-6c008a2f-b4b2-4863-ac81-a19cbc9aa4d5?action=share&creator=30730048)

## 📌 API Endpoints

### 🔑 Authentication Routes (`/api/auth`)
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login and receive a token |
| `GET`  | `/logout` | Logout the user |

### 🏷️ Gadget Management Routes (`/api/gadget`)
| Method | Endpoint | Protected? | Role | Description |
|--------|---------|------------|------|-------------|
| `GET`  | `/getAll` | ❌ No | - | Retrieve all gadgets |
| `GET`  | `/:status` | ❌ No | - | Get gadgets by status |
| `POST` | `/` | ✅ Yes | Quartermaster | Add a new gadget |
| `PATCH` | `/:id` | ✅ Yes | Quartermaster | Update gadget details |
| `PATCH` | `/:id/decommission` | ✅ Yes | Quartermaster | Decommission a gadget |
| `POST` | `/:id/triggerSelfDestruct` | ✅ Yes | Quartermaster | Trigger self-destruct |

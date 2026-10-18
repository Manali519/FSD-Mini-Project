# MedStore Pro

MedStore Pro is a full stack inventory and sales management system for medical stores. Store staff browse available medicines, place orders and print invoices, while administrators track stock levels, expiry dates, revenue and customer purchase history from a single dashboard.

The project uses a React frontend built with Vite and a Node.js/Express REST API backed by MongoDB.

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## Key Features

**For users (store staff and customers)**

- Sign up and log in with JWT-based authentication
- Browse all in-stock medicines with category, manufacturer, price and stock details
- Add items to a cart, with quantities capped at the available stock
- Place orders that deduct stock automically, so two orders can never oversell the same item
- View and print an invoice for every order
- Review full purchase history on the My Orders page

**For administrators**

- Dashboard showing revenue for the last 30 days, total sales count and total sales amount
- Low stock alerts for medicines with 20 or fewer units left
- Expiry alerts for medicines that have expired or will expire within 30 days
- Search medicines by batch number, with an optional near-expiry filter
- View every registered user along with their order count, total spend and order details

**Security**

- Passwords are hashed with bcrypt before they are stored
- Protected routes on both the frontend and the API, with role checks for admin endpoints
- Order prices and totals are always calculated on the server, never taken from the client
- New accounts are always created with the `user` role; admin accounts come only from the seeder

## Tech Stack

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| Frontend | React 19, Vite, React Router, Axios, Lucide icons   |
| Backend  | Node.js, Express 5, Mongoose                        |
| Database | MongoDB                                             |
| Auth     | JSON Web Tokens, bcryptjs                           |

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19 or later, with npm
- A MongoDB database, either a local install or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd " "
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=
JWT_SECRET=
PORT=

SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
SEED_USER_EMAIL=
SEED_USER_PASSWORD=
```

### 3. Seed the database

```bash
npm run seed
```

This creates one admin account, one regular user account, 20 sample medicines and 50 sample orders spread over the last 30 days, so the dashboard has data to show right away.

### 4. Start the backend server

```bash
npm start
```

### 5. Set up and start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

| Variable              | Required          | Description                                      |
| --------------------- | ----------------- | ------------------------------------------------ |
| `MONGO_URI`           | Yes               | MongoDB connection string                        |
| `JWT_SECRET`          | Yes               | Secret key used to sign authentication tokens    |
| `PORT`                | No                | Port for the API server (default `5000`)         |
| `SEED_ADMIN_EMAIL`    | For seeding only  | Email for the seeded admin account               |
| `SEED_ADMIN_PASSWORD` | For seeding only  | Password for the seeded admin account            |
| `SEED_USER_EMAIL`     | For seeding only  | Email for the seeded regular user account        |
| `SEED_USER_PASSWORD`  | For seeding only  | Password for the seeded regular user account     |

### Frontend (`frontend/.env`)

| Variable       | Required | Description                                                  |
| -------------- | -------- | ------------------------------------------------------------ |
| `VITE_API_URL` | No       | Base URL of the backend    |

## Available Scripts

**Backend** (run from `backend/`)

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm start`     | Starts the Express API server                |
| `npm run seed`  | Clears the database and loads sample data    |

**Frontend** (run from `frontend/`)

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Starts the Vite development server           |
| `npm run build`   | Builds the production bundle into `dist/`    |
| `npm run preview` | Serves the production build locally          |
| `npm run lint`    | Runs ESLint across the frontend code         |

## API Endpoints

All endpoints are prefixed with `/api`. Protected endpoints expect an `Authorization: Bearer <token>` header.

| Method | Endpoint                   | Access | Description                                  |
| ------ | -------------------------- | ------ | -------------------------------------------- |
| POST   | `/auth/signup`             | Public | Register a new user                          |
| POST   | `/auth/login`              | Public | Log in and receive a token                   |
| GET    | `/medicines`               | User   | List all medicines that are in stock         |
| POST   | `/orders`                  | User   | Place a new order                            |
| GET    | `/orders/myorders`         | User   | List orders placed by the logged-in user     |
| GET    | `/orders/:id`              | User   | Get one order (owner or admin only)          |
| GET    | `/admin/dashboard`         | Admin  | Revenue, sales and stock/expiry alerts       |
| GET    | `/admin/medicines/search`  | Admin  | Search by `batchNo` and `nearExpiry=true`    |
| GET    | `/admin/users`             | Admin  | List users with their orders and spending    |

## Project Structure

```
mini project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── adminUserController.js
│   │   ├── authController.js
│   │   ├── medicineController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Medicine.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── medicineRoutes.js
│   │   └── orderRoutes.js
│   ├── scripts/
│   │   └── seeder.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── InvoicePage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyOrdersPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── StoreFront.jsx
│   │   ├── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── .gitignore
```

### Backend

| File | Purpose |
| ---- | ------- |
| `server.js` | Entry point. Loads environment variables, registers middleware and routes, sets up the global error handler and starts the server once the database connects. |
| `config/db.js` | Connects to MongoDB using the `MONGO_URI` environment variable. |
| `models/User.js` | User schema with name, date of birth, email, password and role. Hashes passwords before saving and provides a password comparison method. |
| `models/Medicine.js` | Medicine schema with name, unique batch number, category, manufacturer, price, stock and expiry date. |
| `models/Order.js` | Order schema linking a user to the purchased medicines, with quantity, unit price, total amount and payment method. |
| `controllers/authController.js` | Handles signup and login, normalizes email input and issues JWTs valid for 30 days. |
| `controllers/medicineController.js` | Returns all medicines with stock above zero, sorted by name. |
| `controllers/orderController.js` | Places orders with atomic stock deduction and rolls stock back if any item fails. Also returns a user's order history and individual orders. |
| `controllers/adminController.js` | Builds dashboard statistics (revenue, sales, low stock and expiry alerts) and handles medicine search by batch number and expiry. |
| `controllers/adminUserController.js` | Returns all regular users with their order count, total spend and order details. |
| `middleware/authMiddleware.js` | `protect` verifies the JWT and attaches the user to the request. `admin` restricts a route to admin accounts. |
| `routes/authRoutes.js` | Maps `/api/auth` endpoints for signup and login. |
| `routes/medicineRoutes.js` | Maps `/api/medicines` to the medicine listing. |
| `routes/orderRoutes.js` | Maps `/api/orders` endpoints, all protected. |
| `routes/adminRoutes.js` | Maps `/api/admin` endpoints, protected and restricted to admins. |
| `scripts/seeder.js` | Resets the database and loads sample users, medicines (including low-stock and expiring items) and orders. |

### Frontend

| File | Purpose |
| ---- | ------- |
| `index.html` | HTML shell that Vite injects the React app into. |
| `vite.config.js` | Vite configuration with the React plugin. |
| `eslint.config.js` | ESLint rules for React and React Hooks. |
| `src/main.jsx` | Mounts the React app to the page. |
| `src/App.jsx` | Defines all routes and wraps them in the auth and cart providers. Includes a `ProtectedRoute` component that redirects unauthenticated users and enforces roles. |
| `src/api.js` | Axios instance pointed at the backend, which attaches the stored JWT to every request. |
| `src/index.css`, `src/App.css` | Global styles, layout, components and print styles for invoices. |
| `src/context/AuthContext.jsx` | Stores the logged-in user, persists the session in `localStorage` and exposes `login`, `signup` and `logout`. |
| `src/context/CartContext.jsx` | Manages cart items, keeps quantities within available stock and calculates the cart total. |
| `src/components/Navbar.jsx` | Top navigation bar that shows different links for guests, users and admins, and clears the cart on logout. |
| `src/pages/LandingPage.jsx` | Public home page introducing the core features. |
| `src/pages/LoginPage.jsx` | Login form with a toggle between user and admin login. |
| `src/pages/SignupPage.jsx` | Registration form for new users. |
| `src/pages/StoreFront.jsx` | Lists available medicines and lets users add them to the cart. |
| `src/pages/CartPage.jsx` | Shows cart contents and totals, and places the order on checkout. |
| `src/pages/InvoicePage.jsx` | Displays a printable invoice for a completed order. |
| `src/pages/MyOrdersPage.jsx` | Lists the logged-in user's past orders with links to each invoice. |
| `src/pages/AdminDashboard.jsx` | Admin view with inventory statistics, stock and expiry alerts, medicine search and a users tab showing purchase history. |

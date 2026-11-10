# E-Pharmacy Frontend

E-Pharmacy is a responsive online pharmacy application built with Next.js, React, and TypeScript.

The application allows users to browse medicines, explore pharmacy information, view product details, manage their shopping cart, and authenticate through dedicated pages or modal windows.

The frontend communicates with a REST API powered by Node.js, Express, and MongoDB.

## Technologies

- Next.js 16 (App Router)
- React 19
- TypeScript
- CSS Modules
- React Hook Form
- React Hot Toast
- REST API
- ESLint

## Features

### Medicine Catalog

- Browse available medicines
- View product images, names, prices, and categories
- Search and filter products
- Navigate through paginated results
- Open individual product pages

### Product Details

- View detailed product information
- Switch between Description and Reviews tabs
- Select product quantity
- Add medicines to the shopping cart

### Authentication

- User registration
- User login
- JWT-based authentication
- Dedicated login and registration pages
- Login and registration modal windows
- Form validation and error handling
- Authentication-dependent navigation

### Shopping Cart

- Add products to the cart
- Update product quantities
- Remove products
- View cart totals
- Enter delivery information
- Select a payment method

### Additional Sections

- Pharmacy information
- Nearest pharmacy stores
- Customer reviews
- Promotional banners
- Responsive navigation
- Mobile menu

## Responsive Design

The application is designed for different screen sizes:

- Mobile: 320px and above
- Tablet: 768px and above
- Desktop: 1200px and above

The interface follows the provided Figma designs.

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/e-pharmacy-frontend.git
```

Navigate to the project directory:

```bash
cd e-pharmacy-frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://e-pharmacy-backend-qndx.onrender.com/api
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server.

```bash
npm run lint
```

Runs ESLint, if the script is configured in package.json.

## Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   └── (site)/
│
├── components/
│   ├── Auth/
│   ├── AuthModal/
│   ├── Cart/
│   ├── Footer/
│   ├── Header/
│   ├── Medicine/
│   ├── MobileMenu/
│   ├── NearestStores/
│   ├── PharmacyCard/
│   ├── ProductDetails/
│   ├── PromoBanners/
│   └── Reviews/
│
└── lib/
    ├── auth.ts
    └── cart.ts
```

## Backend API

The frontend is connected to the E-Pharmacy Backend.

**Backend URL:**

https://e-pharmacy-backend-qndx.onrender.com

**Backend Repository:**

https://github.com/YOUR_USERNAME/e-pharmacy-backend

### Main API Endpoints

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| GET    | `/api/products`         | Get medicines                 |
| GET    | `/api/products/:id`     | Get product details           |
| GET    | `/api/stores`           | Get pharmacy stores           |
| GET    | `/api/customer-reviews` | Get customer reviews          |
| GET    | `/api/cart`             | Get authenticated user's cart |
| PUT    | `/api/cart/update`      | Update cart quantity          |
| POST   | `/api/cart/checkout`    | Submit an order               |

Cart operations require authentication.

The checkout endpoint is implemented in the backend, but the complete frontend checkout flow still requires end-to-end verification.

## Authentication Flow

1. A user opens the login or registration page, or an authentication modal.
2. The user submits their credentials.
3. The backend validates the request.
4. On successful login, the frontend receives an access token.
5. The token is stored in sessionStorage.
6. Protected API requests include the token in the Authorization header.

Unauthenticated users are prompted to log in when attempting to add products to the cart.

## Current Development Status

Implemented:

- Responsive application layout
- Medicine catalog
- Product details
- Product reviews section
- Authentication pages
- Authentication modals
- Shopping cart interface
- Backend API integration

Pending verification or improvements:

- Complete checkout flow
- Production deployment testing
- Additional error handling and UX improvements

## Author

**Ihor Kuzmenko**

Frontend / Fullstack Developer

[LinkedIn](https://www.linkedin.com/in/ihor-kuzmenko-336b79213/)

## License

This project is intended for educational and portfolio purposes.

```

```

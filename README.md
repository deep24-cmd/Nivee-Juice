# Organic E-commerce Website

A full-stack e-commerce platform for organic products with customer shopping cart, Razorpay payment integration, and admin panel for order management.

## Features

- **Customer Features:**
  - Browse products
  - Shopping cart functionality
  - Guest checkout (no registration required)
  - Razorpay payment integration
  - Order confirmation

- **Admin Features:**
  - Secure admin login
  - View all orders
  - Update order status
  - Generate invoices
  - Product management

## Technology Stack

- Frontend: HTML5, CSS3, JavaScript, Bootstrap 5
- Backend: Node.js, Express.js
- Database: MySQL
- Payment Gateway: Razorpay

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update database credentials
   - Add Razorpay API keys
   - Set session secret

4. Set up database:
   - Create MySQL database
   - Run the schema from `backend/models/schema.sql`

5. Start the server:
   ```bash
   npm start
   ```

6. Access the website:
   - Customer site: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin/login.html`

## Default Admin Credentials

- Username: `admin`
- Password: `admin123`

**Important:** Change the default admin password after first login!

## Project Structure

```
organic-shop/
├── frontend/          # Frontend files
├── backend/           # Backend API
├── package.json       # Dependencies
└── .env              # Environment variables
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/logout` - Admin logout

## License

ISC







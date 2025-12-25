# Quick Start Guide

## First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   - Create MySQL database: `organic_shop`
   - Import schema: `backend/models/schema.sql`

3. **Configure environment:**
   - Create `.env` file (see SETUP.md for details)
   - Add Razorpay API keys
   - Set database credentials

4. **Start server:**
   ```bash
   npm start
   ```

5. **Access:**
   - Website: http://localhost:3000
   - Admin: http://localhost:3000/admin/login.html
   - Default admin: `admin` / `admin123`

## Key Features

### Customer Side
- Browse products
- Add to cart
- Guest checkout (no registration)
- Razorpay payment
- Order confirmation

### Admin Side
- View all orders
- Update order status
- Generate invoices
- Dashboard statistics

## Project Structure

```
├── backend/          # Node.js/Express API
│   ├── config/       # Configuration
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth middleware
│   ├── models/       # Database models
│   └── routes/       # API routes
├── frontend/         # HTML/CSS/JS
│   ├── public/       # Static assets
│   └── views/        # HTML pages
└── package.json      # Dependencies
```

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/orders` - Create order
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `GET /api/orders` - Get orders (admin)
- `POST /api/admin/login` - Admin login

## Adding New Products

Products can be added through:
1. Database directly (INSERT into products table)
2. Admin API (POST /api/products) - requires authentication
3. Future: Admin product management UI

## Important Notes

- Change default admin password after first login
- Use Razorpay test keys for development
- Product images go in `frontend/public/images/`
- Cart uses localStorage (browser-based)







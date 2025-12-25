# Setup Instructions

## Prerequisites

1. Node.js (v14 or higher)
2. MySQL (v5.7 or higher)
3. Razorpay account (for payment gateway)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE organic_shop;
```

2. Run the schema file to create tables:
```bash
mysql -u root -p organic_shop < backend/models/schema.sql
```

Or import it through phpMyAdmin/MySQL Workbench.

### 3. Environment Configuration

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=organic_shop

# Server Configuration
PORT=3000
NODE_ENV=development

# Razorpay Configuration
# Get these from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Session Secret (generate a random string)
SESSION_SECRET=your_random_session_secret_here_min_32_characters

# Admin Default Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. Razorpay Setup

1. Sign up at https://razorpay.com
2. Go to Settings > API Keys
3. Generate Test Keys (for development) or Live Keys (for production)
4. Copy Key ID and Key Secret to `.env` file

### 5. Product Images

Place product images in `frontend/public/images/`:
- `honey.jpg` - For Organic Honey
- `green-tea.jpg` - For Organic Green Tea

Or use placeholder images. The system will handle missing images gracefully.

### 6. Start the Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### 7. Access the Application

- **Customer Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login.html

### 8. Default Admin Credentials

- Username: `admin`
- Password: `admin123`

**IMPORTANT**: Change the admin password after first login!

## Testing Payment

For testing payments, use Razorpay test mode:
- Use test API keys from Razorpay dashboard
- Use test card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `organic_shop` exists

### Razorpay Payment Not Working
- Verify API keys are correct
- Check if using test keys in test mode
- Ensure Razorpay checkout script is loaded

### Admin Login Not Working
- Check if admin user was created (run schema.sql)
- Verify session secret is set in `.env`
- Clear browser cookies and try again

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use Razorpay Live Keys
3. Change default admin password
4. Use strong session secret
5. Enable HTTPS
6. Set up proper database backups
7. Configure firewall and security settings







# PowerShell script to create .env file
$envContent = @"
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=organic_shop

# Server Configuration
PORT=3000
NODE_ENV=development

# Razorpay Configuration
# Get these from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Session Secret (generate a random string)
SESSION_SECRET=organic_shop_secret_key_change_in_production_12345

# Admin Default Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8
Write-Host ".env file created successfully!"







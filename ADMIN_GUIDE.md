# Nivee Juices - Business Management Guide

This guide explains how to manage your Nivee Juices website and admin dashboard.

## 1. Starting the Website
Before you can access the website or admin panel, ensure the server is running.
1. Open your terminal (PowerShell or Command Prompt).
2. Navigate to your project folder: `cd "d:\Pj Niv"`
3. Run the command: `npm run dev`
4. Keep this window open. If you close it, the website will stop working.

## 2. Accessing the Website
- **Customer View**: [http://localhost:3000](http://localhost:3000)
  - This is what your customers see. They can browse products, add to cart, and place orders.

- **Admin Panel**: [http://localhost:3000/admin/login.html](http://localhost:3000/admin/login.html)
  - This is where you manage your business.

## 3. Logging into Admin Panel
- **URL**: [http://localhost:3000/admin/login.html](http://localhost:3000/admin/login.html)
- **Username**: `admin`
- **Password**: `admin123`
*(You can change these in the `.env` file)*

## 4. Managing Products
Once logged in, click the **"Products"** tab.

### Add a New Product
1. Click the green **"Add New Product"** button.
2. Fill in the details:
   - **Name**: e.g., "Nivee Amla Juice"
   - **Price**: Selling price in Rupees (e.g., 180).
   - **Stock**: Number of bottles available.
   - **Image**: Upload a product photo.
   - **Description**: Short summary.
   - **Benefits**: Key health benefits (one per line).
3. Click **"Save Product"**.

### Edit a Product
1. Find the product in the list.
2. Click the **"Edit"** button.
3. specific details (e.g., change Price from 180 to 200).
4. Click **"Save Product"**.

### Delete a Product
1. Click the **"Delete"** button next to the product.
2. Confirm the deletion.

## 5. Managing Orders
Click the **"Orders"** tab to see incoming customer orders.

### Viewing Orders
- A list of all orders is displayed with **Order #**, **Customer Name**, **Amount**, and **Status**.
- **Pending**: New order, not yet processed.
- **COD**: Cash on Delivery.

### Updating Order Status
As you process orders, keep the status updated so you can track them:
1. Click the **"Update"** button next to an order.
2. Change **Order Status**:
   - `Processing`: You are packing the order.
   - `Shipped`: You have handed it to the courier.
   - `Delivered`: Customer received the product.
   - `Cancelled`: Order was cancelled.
3. Change **Payment Status**:
   - `Pending`: Payment not yet received (common for COD before delivery).
   - `Completed`: Cash received.
4. Click **"Update"**.

### Printing Invoices
1. Click the **"Invoice"** button next to an order.
2. This opens a printable invoice view.
3. Press `Ctrl + P` to print or save as PDF.

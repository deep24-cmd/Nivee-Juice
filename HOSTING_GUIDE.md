# Hosting Guide for Nivee Juices

This guide will walk you through hosting your website so it can be accessed by anyone on the internet.

Since your project uses **Node.js** and a **MySQL Database**, we recommend using **Railway** or **Render** as they handle both easily.

---

## Prerequisites
1.  **GitHub Account**: You need this to store your code. [Sign up here](https://github.com/).
2.  **Hosting Account**: We will use **Railway.app** (Simplest, paid/trial) or **Render.com** (Free tier available).

---

## Step 1: Put Your Code on GitHub
Your code currently lives only on your laptop. We need to push it to the cloud.

1.  **Initialize Git**:
    Open your terminal in VS Code and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit for Nivee Juices"
    ```

2.  **Create a Repository**:
    *   Go to [GitHub.com/new](https://github.com/new).
    *   Name it `pj-niv` or `nivee-juices`.
    *   Click **Create repository**.

3.  **Connect and Push**:
    *   Copy the commands shown under "…or push an existing repository from the command line".
    *   They will look like this (replace `YOUR_USERNAME`):
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/nivee-juices.git
    git branch -M main
    git push -u origin main
    ```

---

## Step 2: Set Up the Database (The Hardest Part)
Since you are using MySQL locally, you need a MySQL database in the cloud.

**Option A: Railway (Recommended for ease)**
1.  Log in to [Railway.app](https://railway.app/).
2.  Click **New Project** > **Provision MySQL**.
3.  Once created, click on the MySQL box > **Variables**.
4.  Copy the connection details (Host, User, Password, Database Name).

**Option B: Aiven (Free Tier)**
1.  Go to [Aiven.io](https://aiven.io/) and sign up.
2.  Create a **MySQL** service (select the Free tier if available).
3.  Get the `Service URI` or connection details.

---

## Step 3: Configure Your App for the Cloud
You need to tell your hosting provider about your secret keys (the ones in your `.env` file).

1.  In your Dashboard (Railway or Render), find **Settings** or **Environment Variables**.
2.  Add the following variables (copy values from your local `.env` file, but use the **Cloud Database** details for the DB part):

    *   `DB_HOST`: (Your cloud database host)
    *   `DB_USER`: (Your cloud database user)
    *   `DB_PASSWORD`: (Your cloud database password)
    *   `DB_NAME`: (Your cloud database name)
    *   `SESSION_SECRET`: (Generate a random long string)
    *   `ADMIN_USERNAME`: `admin`
    *   `ADMIN_PASSWORD`: (Set a strong password)
    *   `RAZORPAY_KEY_ID`: (Your actual Razorpay Key ID)
    *   `RAZORPAY_KEY_SECRET`: (Your actual Razorpay Secret)

---

## Step 4: Import Your Database
Your cloud database is empty. You need to send your tables there.

1.  Download a tool like **HeidiSQL** or **MySQL Workbench**.
2.  Connect to your **Cloud Database** using the credentials from Step 2.
3.  Open the SQL file located at `d:\Pj Niv\backend\models\schema.sql` (Note: You might need to create this first from your local DB).
    *   *Alternative*: I can help you generate a schema file to run.
4.  Run the SQL script to create your tables (`users`, `products`, `orders`, etc.).

---

## Step 5: Deploy the Website
**If using Render:**
1.  Click **New +** > **Web Service**.
2.  Connect your GitHub repository.
3.  **Build Command**: `npm install`
4.  **Start Command**: `npm start`
5.  Click **Create Web Service**.

**If using Railway:**
1.  Click **New Project** > **Deploy from GitHub repo**.
2.  Select your `nivee-juices` repo.
3.  It will automatically detect Node.js and deploy.

---

## Success!
Once deployed, the platform will give you a public URL (e.g., `https://nivee-juices.onrender.com`). You can share this with your customers!

require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixImages() {
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'organic_shop'
    };

    const conn = await mysql.createConnection(dbConfig);
    try {
        console.log('Updating image URLs...');

        // Fix ID 4 (Triphala)
        await conn.query('UPDATE products SET image_url = "/images/nivee-triphala-juice.jpg" WHERE id = 4');

        // Fix ID 6 (Sugar Cure)
        await conn.query('UPDATE products SET image_url = "/images/nivee-sugarcure-juice.jpg" WHERE id = 6');

        // Fix ID 7 (Aloe Vera)
        await conn.query('UPDATE products SET image_url = "/images/nivee-aloe-juice.jpg" WHERE id = 7');

        console.log('Image URLs updated successfully.');
    } catch (err) {
        console.error('Error updating images:', err);
    } finally {
        await conn.end();
    }
}

fixImages();

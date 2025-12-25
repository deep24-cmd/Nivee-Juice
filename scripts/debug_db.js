require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
};

async function listDatabases() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SHOW DATABASES');
        console.log('Available databases:');
        rows.forEach(row => console.log(`- ${row.Database}`));
        await connection.end();
    } catch (err) {
        console.error('Error connecting to MySQL:', err.message);
    }
}

listDatabases();

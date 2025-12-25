const pool = require('./backend/models/db');

async function run() {
    try {
        await pool.execute('ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT "razorpay" AFTER total_amount');
        console.log('Column added or already exists');
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column already exists');
        } else if (error.errno === 1064) {
            // IF NOT EXISTS might not be supported, try without it
            try {
                await pool.execute('ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT "razorpay" AFTER total_amount');
                console.log('Column added');
            } catch (innerError) {
                if (innerError.code === 'ER_DUP_COLUMN_NAME') {
                    console.log('Column already exists');
                } else {
                    console.error('Error adding column:', innerError);
                }
            }
        } else {
            console.error('Database error:', error);
        }
    } finally {
        await pool.end();
    }
}

run();

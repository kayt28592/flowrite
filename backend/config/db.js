const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flowrite', {
            // Mongoose 6+ không cần các options cũ
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.log('');
        console.log('💡 Make sure MongoDB is running:');
        console.log('   brew services start mongodb-community  (Mac)');
        console.log('   sudo systemctl start mongod  (Linux)');
        console.log('   Or use MongoDB Atlas (cloud): https://cloud.mongodb.com');
        console.log('');
        process.exit(1);
    }
};

module.exports = connectDB;

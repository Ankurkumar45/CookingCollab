const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const connectDB = async () => {
    try {
        console.log('Attempting MongoDB connection.....')
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        if(process.env.NODE_ENV === 'development'){
            console.error('Full error:', error)
        }
        throw error;
    }
};

module.exports = { connectDB };
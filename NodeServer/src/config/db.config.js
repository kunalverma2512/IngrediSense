import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
    // Connection event listener
    mongoose.connection.on('connected', () => {
        logger.info('MongoDB Connected');
        console.log('✅ Database connected.');
    });

    mongoose.connection.on('error', (err) => {
        logger.error(`MongoDB connection error: ${err.message}`);
        console.error(`❌ Database connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        console.log('⚠️  Database disconnected.');
    });

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DATABASE_NAME || 'IngrediSense',
        });
    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        // Don't exit process - allow server to run without DB for now
        // process.exit(1);
    }
};

export default connectDB;

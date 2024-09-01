import mongoose from 'mongoose';
import dotenv from 'dotenv'
import logger from '../utils/logger.js';

dotenv.config()

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

db.on('error', (error) => {
    logger.error('Connection error:', error);
});


db.once('open', () => {
    logger.info('Connected to MongoDB');
});

export default db;
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectdb from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authroutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectdb();

app.use(
    cors({
        origin: '*',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('api/auth', authroutes);

app.use(errorHandler);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        statuscode: 404,
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});

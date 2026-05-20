import multer from 'multer';
import path, { parse } from 'path';
import {fileURLPath } from 'url';
import fs from 'fs';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import Document from '../models/Document.js';
import mongoose from 'mongoose';
import { chunkText } from '../utils/textChunker.js';

const __dirname = path.dirname(__filename);
const __filename = fileURLPath(import.meta.url);

const uploadDir = path.join(__dirname, '..', 'uploads', 'documents');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }
});

export default upload;
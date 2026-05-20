import multer from 'multer';
import path from 'path';
import {fileURLPath } from 'url';
import fs from 'fs';
import { extractTextFromPDF } from '../utils/pdfUtils.js';
import Document from '../models/Document.js';
import mongoose from 'mongoose';
import { chunkText } from '../utils/textUtils.js';

const __dirname = path.dirname(__filename);
const __filename = fileURLPath(import.meta.url);

const uploadDir = path.join(__dirname, '..', 'uploads', 'documents');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(upload

const storage = multer.diskStorage({
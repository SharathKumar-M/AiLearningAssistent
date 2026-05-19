import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { extractTextFromPDF } from '../utils/textChunker.js';
import  { chunkText } from '../utils/textChunker.js';
import fs from 'fs';
import mongoose from 'mongoose';

export const uploadDocument = async (req, res, next) => {
    try {
        if(!req.file){
            return res.status(400).json({ 
                success: false,
                error: 'Please upload a PDF document.',
                statusCode: 400

             });
        }

        const {title} = req.body;

        if(!title){
            await fs.unlink(req.file.path);
            return res.status(400).json({ 
                success: false,
                error: 'Title is required.',
                statusCode: 400
                });
        }

        const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
        const filetUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

        const document = await Document.create({
            userId: req.user._id,
            title,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            filePath: fileUrl,
            status:'processing'
        });

        processPDF(document._id, req.file.path).catch(err => {
            console.error('Error processing PDF:', err);
        
        });

        res.status(201).json({
            success: true,
            data: document,
            message: 'Document uploaded successfully. Processing in background.',
        });
    }
    catch (error) {
        if(req.file){
            await fs.unlink(req.file.path).catch(()  => {});
        }
    

        next(error);
    }

};


export const getDocuments = async (req, res, next) => {
     try {
    }
    catch (error) {
       
        next(error);
    }

};

export const getDocument = async (req, res, next) => {
    try {
    }
    catch (error) {
       
        next(error);
    }

};

export const deleteDocument = async (req, res, next) => {
    try {
    }
    catch (error) {
         next(error);
    }

};

export const updateDocument = async (req, res, next) => {
    try {
    }
    catch (error) {
       
        next(error);
    }
    
};
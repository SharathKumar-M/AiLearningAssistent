import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

/** 
    * @param {string} filepath
    * @returns {Promise<{text: string, numPages: number}>}
*/

export const extractTextFromPDF =async (filepath) => {
    try {
        const dataBuffer = await fs.readFile(filepath);
        const parser = new PDFparse(new Unit8Array(dataBuffer));
        const data = await parser.getText();
        return {
            text: data.text,
            numPages: data.numpages,
            info: data.info,
        };

    }catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF");
    }
};
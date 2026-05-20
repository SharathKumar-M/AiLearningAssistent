/**
 * Splits a given text into chunks of a specified size with an optional overlap.
 * @param {string} text - The input text to be chunked.
 * @param {number} chunkSize - The maximum size of each chunk.
 * @param {number} overlap - The number of characters to overlap between chunks (default is 0).
 * @returns {Array[{content: string, chunkIndex: number}]} An array of text chunks.
 */

export const chunkText = (text, chunkSize=500, overlap = 50) => {
    if(!text || text.trim().length === 0) {
        return [];
    }

    const cleanedText = text
    .replace(/\r\n/g, '\n') // Normalize newlines
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/\n /g, '\n')
    .replace(/ \n/g, '\n')
    .trim();
    

    const paragraphs = cleanedText.split('/\n+/').filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;


    for (paragraph of paragraphs) {
        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        if(paragraphWordCount > chunkSize) {
            if(currentChunk.length > 0) {
                chunks.push({content: currentChunk.join('\n\n'), chunkIndex: chunkIndex++, pageNumber: 0});
                
                currentChunk = [];
                currentWordCount = 0;
            }
            for(let i = 0; i < paragraphWords.length; i += (chunkSize - overlap)) {      
                const chunkWords = paragraphWords.slice(i, i + chunkSize);
                chunks.push({content: chunkWords.join(' '), chunkIndex: chunkIndex++, pageNumber: 0});

                if(i + chunkSize >= paragraphWords.length) break; 
            }
            continue;
            
            }

            if(currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
                chunks.push({content: currentChunk.join('\n\n'), chunkIndex: chunkIndex++, pageNumber: 0});
            

             const prevChunkText = currentChunk.join(' ');
             const prevWords = prevChunkText.split(/\s+/);   
             const overlapWords = prevWords.slice(-Math.min(overlap, prevWords.length)).join('');

             currentChunk = [overlapText, paragraph.trim()];
             currentWordCount = overlapWords.split(/\s+/).length + paragraphWordCount;
            } else {
                currentChunk.push(paragraph.trim());
                currentWordCount += paragraphWordCount;
            }
        }

        if(currentChunk.length > 0) {
            chunks.push({content: currentChunk.join('\n\n'), chunkIndex: chunkIndex++, pageNumber: 0});
        }



        if(chunks.length === 0 && cleanedText.length > 0) {
            const allWords = cleanedText.split(/\s+/);
            for(let i = 0; i < allWords.length; i += (chunkSize - overlap)) {
                const chunkWords = allWords.slice(i, i + chunkSize);
                chunks.push({content: chunkWords.join(' '), chunkIndex: chunkIndex++, pageNumber: 0});

                if(i + chunkSize >= allWords.length) break;
            }
        }

    return chunks;
};


export const findRelaventChunk = (chunks, query, maxChunks = 3) => {
   if(!chunks || chunks.length === 0 || !query)
     return [];
    }

    const stopWords = new Set(['and', 'the', 'is', 'in', 'at', 'of', 'a', 'to', 'it', 'that', 'with', 'as', 'for', 'was', 'on', 'by', 'are', 'this', 'be', 'from']);


   const queryWords = query
   .toLowerCase()
   .split(/\s+/)
   .filter(w => w.length > 2 && !stopWords.has(w));

   if(queryWords.length === 0) 
    return chunks.slice(0, maxChunks).map(chunk => ({
        content: chunk.content,
        chunkIndex: chunk.chunkIndex,
        pageNumber: chunk.pageNumber,
        _id: chunk._id
    }));

   const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const contentWords = content.split(/\s+/).length;
    let score = 0;
    
    for (const word of queryWords) {
        
        const exactMatches = (content.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
        score += exactMatches * 2;

        const partialMatches = (content.match(new RegExp(word, 'g')) || []).length;
        score += Math.max(0, partialMatches - exactMatches) * 1.5;

    }

    const uniqueWordsFound = queryWords.filter(word => content.includes(word)).length;
    if(uniqueWordsFound > 1) {
        score += uniqueWordsFound * 2;
    }

    const normalizedScore =  score / Math.sqrt(contentWords);

    const positionBonus = 1 - (index / chunks.length)*0.1;

    return {
        content: chunk.content,
        chunkIndex: chunk.chunkIndex,
        pageNumber: chunk.pageNumber,
        _id: chunk._id,
        score: normalizedScore * positionBonus,
        rawScore: score,
        matchWords: uniqueWordsFound
    };
   });

    
   return scoredChunks
    .filter(chunk => chunk.score > 0)
    .sort((a, b) => {
        if(b.score !== a.score) {
            return b.score - a.score;
        }
    

        if (b.matchedWords !== a.matchedWords) {
            return b.matchedWords - a.matchedWords;
        }
        return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);

   

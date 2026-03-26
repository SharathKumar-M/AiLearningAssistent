import { stat } from "fs";

const errorHandler = (err, req, res, next) => {
let statusCode = err.statusCode || 500;
let message = err.message || 'Server Error';

if(err.name == 'CastError'){
    message='Resource Not Found',
    statusCode=404;
}

if(err.code == 11000){
    const field = Object.keys(err.keyValue);
    message = `Duplicate value entered for ${field} field, please choose another value.`;
    statusCode = 400;
}

if(err.name == 'ValidationError'){
    message= Object.values(err.errors).map((val) => val.message).join(', ');
    statusCode = 400;
}

if(err.code == 'LIMIT_FILE_SIZE'){
    message = 'File size is too large. Maximum limit is 1MB.';
    statusCode = 400;

}

if(err.name == 'JsonWebTokenError'){
    message = 'Invalid token. Please log in again.';
    statusCode = 401;
}

if(err.name == 'TokenExpiredError'){
    message = 'Your token has expired. Please log in again.';
    statusCode = 401;
}

console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? 'err.stack' : undefined
});

res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
});

};

export default errorHandler;
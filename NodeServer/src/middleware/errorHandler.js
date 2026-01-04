import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    logger.error(`Stack: ${err.stack}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;

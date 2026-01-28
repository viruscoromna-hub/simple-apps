// Logging
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}] ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};

module.exports = logger;

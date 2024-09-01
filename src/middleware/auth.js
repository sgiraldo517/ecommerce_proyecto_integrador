import logger from '../utils/logger.js'; 

export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        logger.info(`User ${req.session.user.email} is authenticated.`);
        return next();
    } else {
        logger.warn('Unauthenticated access attempt.');
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        logger.info('User is not authenticated.');
        return next();
    } else {
        logger.warn(`Authenticated user ${req.session.user.email} attempted to access a non-authenticated area.`);
        res.redirect('/current');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        logger.info(`Admin user ${req.user.email} accessed an admin-only area.`);
        return next();
    } else {
        logger.warn(`Access denied: User ${req.user ? req.user.email : 'Unknown'} attempted to access an admin-only area.`);
        res.status(403).send("Access denied: Admins only");
    }
};

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        logger.info(`User ${req.user.email} accessed a user-only area.`);
        return next();
    } else {
        logger.warn(`Access denied: User ${req.user ? req.user.email : 'Unknown'} attempted to access a user-only area.`);
        res.status(403).send("Access denied: Users only");
    }
};

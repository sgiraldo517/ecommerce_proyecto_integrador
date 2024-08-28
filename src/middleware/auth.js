export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/current');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        res.status(403).send("Access denied: Admins only");
    }
};

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    } else {
        res.status(403).send("Access denied: Users only");
    }
};
const jwt = require('jsonwebtoken');
const private = require('../private');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];

        // send error message and redirect to login page if no token
    if (!token) {
        res.status(401).send("Access denied. No token provided.");
        res.redirect('');
    }

    // if token exists, compare token with stored user data
    try{
        const decoded = jwt.verify(token, private);
        req.user = decoded;
        next();
    } catch(err) {
        res.status(400).send("Invalid token.");
    }
};

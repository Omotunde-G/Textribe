const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided. Unauthorized.' });
    }

    jwt.verify(token, process.env.secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token. Access forbidden.' });
        }

        req.user = user; // Attach the user object (including user_id) to the request
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;

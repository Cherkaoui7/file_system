const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // 1. Log the raw header to see what Postman is sending
    console.log("👉 Headers received:", req.headers.authorization);

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // 2. Log the token we extracted
            console.log("👉 Token extracted:", token);

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Log the decoded ID
            console.log("👉 Decoded ID:", decoded.id);

            // Get user from the token payload
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log("❌ User not found in DB");
                return res.status(401).json({ success: false, error: 'User not found' });
            }

            next();
        } catch (error) {
            console.error("❌ Auth Error:", error.message);
            res.status(401).json({ success: false, error: 'Not authorized, token failed' });
        }
    } else {
        console.log("❌ No Bearer token found");
        res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'User context missing' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};
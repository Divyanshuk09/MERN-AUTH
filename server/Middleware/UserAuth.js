import jwt from 'jsonwebtoken'

// Middleware to check if user is authenticated
const userAuth = async (req, res, next) => {
    const token = req.cookies.token;
    // Agar token nahi mila toh user ko login karne bol do
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Token expired or missing. Login again."
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
        if (decodedToken && decodedToken.id) {
            if (!req.body) req.body = {};
            req.body.userId = decodedToken.id;
            return next();
        } else {
            return res.status(403).json({
                success: false,
                message: "You are not authorized. Please log in again."
            });
        }
    
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
    
};

export default userAuth;

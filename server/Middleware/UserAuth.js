import jwt from 'jsonwebtoken';

// Middleware to check if user is authenticated
const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // Token missing
    if (!token) {
      return res.json({
        success: false,
        message: "Token expired or missing. Login again."
      });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken && decodedToken.id) {
      // Set userId in request
      req.userId = decodedToken.id;
      return next();
    }

    // If token is invalid
    return res.json({
      success: false,
      message: "You are not authorized. Please log in again."
    });

  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error."
    });
  }
};

export default userAuth;

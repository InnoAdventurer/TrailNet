// backend/middlewares/authMiddleware.js

import pkg from 'jsonwebtoken';
const { verify } = pkg;

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Ensure Bearer is stripped

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET); // Decode the JWT token
    req.user = decoded; // Attach the decoded user data (which should contain the userId) to req.user
    next(); // Call next to proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;

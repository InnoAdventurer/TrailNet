// middlewares/authMiddleware.js

import { verify } from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Get the token from the headers
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user to the request object
    req.user = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('Authorization Header:', req.header('Authorization'));
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    console.log('No token found after replacing "Bearer "');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token is not valid', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;

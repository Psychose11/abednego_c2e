const key = require('./tokenKey.js');
const jwt = require('jsonwebtoken');

function decrypt(req ,res ,token) { 

  jwt.verify(token, key(), (err, decoded) => {
    if (err) {
      console.error('Error :', err);
      return res.status(401).json({ message: 'Invalid' });
    } 
    else {
      req.userId = decoded.userId;
    } 
  });
}

module.exports = decrypt;
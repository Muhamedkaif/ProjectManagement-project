const jwt = require('jsonwebtoken');
require('dotenv').config({ override: true });

const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecretjwtkeyforprojectmanagement',
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'supersecretjwtkeyforprojectmanagement'
  );
};

module.exports = {
  signToken,
  verifyToken
};

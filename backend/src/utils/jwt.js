const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate a signed JWT for a given user.
 *
 * @param {string} userId   - Mongoose ObjectId as string
 * @param {string} username - User's display name
 * @param {string} role     - 'USER' | 'ADMIN'
 * @returns {string} Signed JWT
 */
const generateToken = (userId, username, role) => {
  const payload = { userId, username, role };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
};

/**
 * Verify a JWT and return the decoded payload.
 *
 * @param {string} token - JWT string (without "Bearer " prefix)
 * @returns {object} Decoded payload { userId, username, role, iat, exp }
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

module.exports = { generateToken, verifyToken };


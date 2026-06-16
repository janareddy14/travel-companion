const { verifyToken } = require('../utils/jwt');

/**
 * JWT authentication middleware.
 *
 * Expects: Authorization: Bearer <token>
 * Sets:    req.user = user document from DB (without password)
 */
const auth = async (req, res, next) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authentication required' });
    }

    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Look up user in database
    // Lazy-require to avoid circular dependency at module load time
    const User = require('../models/User');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Authentication required' });
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Authentication required' });
  }
};

module.exports = auth;

/**
 * Admin authorization middleware.
 *
 * MUST be placed AFTER the auth middleware so that req.user is populated.
 * Returns 403 if the authenticated user does not have the ADMIN role.
 */
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ message: 'Admin access required' });
  }
  next();
};

module.exports = admin;

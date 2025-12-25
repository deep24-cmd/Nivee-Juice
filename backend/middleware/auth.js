// Admin authentication middleware
const isAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized. Admin access required.' });
};

module.exports = { isAdmin };







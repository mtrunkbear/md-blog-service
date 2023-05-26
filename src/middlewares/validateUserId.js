// Middleware to validate user id in the route
const validateUserId = (req, res, next) => {
  if (req.params.userId && req.user.id !== req.params.userId) {
    return res.status(403).json({ error: "Denegated access" });
  }

  next();
};

module.exports = validateUserId;

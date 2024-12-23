const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again after 15 minutes.",
});

module.exports = { loginLimiter };

const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.errors.map((error) => {
      return `${error.msg}`;
    });

    return res.status(400).json({ errors });
  }
  next();
};

module.exports = { handleValidationErrors };

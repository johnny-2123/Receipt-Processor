const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  // Get Validation Errors from req
  const validationErrors = validationResult(req);

  // If there are validation errors, create an array of error messages and return error response
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.errors.map((error) => {
      return `${error.msg}`;
    });

    return res.status(400).json({ errors });
  }

  // If there are no validation errors, continue to next middleware
  next();
};

module.exports = { handleValidationErrors };

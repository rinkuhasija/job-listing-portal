const { body, validationResult } = require('express-validator');

const validateJobPost = [
    body('company_name').isString().isLength({ min: 3 }),
    body('logo_url').isString().isLength({ min: 10 }),
    body('job_position').isString().isLength({ min: 10 }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      next();
    }
  ];

module.exports = validateJobPost;
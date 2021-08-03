const { check } = require('express-validator');
const { Router } = require('express');
const router = Router();

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');

const { tokenValidator } = require('../middlewares/token-validator');

// Register User
router.post(
  '/new',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('username', 'Username must be between 6 and 16 characters').isLength({
      min: 6,
      max: 16,
    }),

    check('email', 'Email is invalid').isEmail(),

    check('password', 'Password is required').not().isEmpty(),
    check('password', 'Password must be between 6 and 32 characters').isLength({
      min: 6,
      max: 32,
    }),
    fieldValidator,
  ],
  createUser
);

// Login User
router.post(
  '/',
  [
    check('email', 'Email is invalid').isEmail(),

    check('password', 'Password is required').not().isEmpty(),
    check('password', 'Password must be between 6 and 32 characters').isLength({
      min: 6,
      max: 32,
    }),
    fieldValidator,
  ],

  loginUser
);

// Renew Login Token
router.get('/renew', tokenValidator, renewToken);

module.exports = router;

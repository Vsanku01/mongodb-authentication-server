const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/reset', AuthController.sendMail);
router.post('/reset_password', AuthController.resetPassword);

module.exports = router;

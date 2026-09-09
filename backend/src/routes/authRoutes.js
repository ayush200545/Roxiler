const express = require('express');
const { register, login, updatePassword } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected route to update password
router.put('/password', verifyToken, updatePassword);

module.exports = router;

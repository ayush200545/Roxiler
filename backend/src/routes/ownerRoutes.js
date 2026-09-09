const express = require('express');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const { getOwnerDashboard } = require('../controllers/ownerController');

const router = express.Router();

// Apply auth middleware to all owner routes
router.use(verifyToken);
router.use(requireRole(['STORE_OWNER']));

// Get owner dashboard stats and ratings
router.get('/dashboard', getOwnerDashboard);

module.exports = router;

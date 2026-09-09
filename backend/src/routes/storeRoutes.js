const express = require('express');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const { getAllStores, submitOrUpdateRating } = require('../controllers/storeController');

const router = express.Router();

// Apply auth middleware to all store routes
router.use(verifyToken);
// Normal Users and Admins can view stores (though admins have their own dashboard route, it's safe to allow here)
router.use(requireRole(['NORMAL_USER', 'ADMIN']));

// Fetch stores and search
router.get('/', getAllStores);

// Rate a store
router.post('/:id/rate', submitOrUpdateRating);

module.exports = router;

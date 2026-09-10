const express = require('express');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const { getAllStores, submitOrUpdateRating } = require('../controllers/storeController');

const router = express.Router();

router.use(verifyToken);

router.get('/', requireRole(['NORMAL_USER']), getAllStores);
router.post('/:id/rate', requireRole(['NORMAL_USER']), submitOrUpdateRating);

module.exports = router;

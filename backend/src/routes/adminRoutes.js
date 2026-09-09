const express = require('express');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const {
  getDashboardStats,
  addUser,
  addStore,
  getUsers,
  getStores
} = require('../controllers/adminController');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(verifyToken);
router.use(requireRole(['ADMIN']));

// Dashboard and Stats
router.get('/dashboard', getDashboardStats);

// User Management
router.post('/users', addUser);
router.get('/users', getUsers);

// Store Management
router.post('/stores', addStore);
router.get('/stores', getStores);

module.exports = router;

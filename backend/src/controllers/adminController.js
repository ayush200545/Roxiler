const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

// --- Helper Functions ---
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role
      }
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address || !ownerId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== 'STORE_OWNER') {
      return res.status(400).json({ message: 'Invalid owner ID or user is not a STORE_OWNER' });
    }

    const newStore = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId
      }
    });

    res.status(201).json({ message: 'Store created successfully', store: newStore });
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).json({ message: 'Error creating store' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, order } = req.query;

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };
    if (role) where.role = role;

    const orderBy = {};
    if (sortBy && ['name', 'email'].includes(sortBy)) {
      orderBy[sortBy] = order === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const users = await prisma.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        store: {
          select: {
            ratings: { select: { value: true } }
          }
        }
      }
    });

    // Calculate average store rating for store owners
    const formattedUsers = users.map(user => {
      let storeRating = null;
      if (user.role === 'STORE_OWNER' && user.store && user.store.ratings.length > 0) {
        const total = user.store.ratings.reduce((acc, curr) => acc + curr.value, 0);
        storeRating = (total / user.store.ratings.length).toFixed(1);
      }
      const { store, ...userData } = user;
      return { ...userData, storeRating };
    });

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, address, sortBy, order } = req.query;

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    const orderBy = {};
    if (sortBy && ['name', 'email'].includes(sortBy)) {
      orderBy[sortBy] = order === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const stores = await prisma.store.findMany({
      where,
      orderBy,
      include: {
        ratings: true
      }
    });

    const formattedStores = stores.map(store => {
      let overallRating = 0;
      if (store.ratings.length > 0) {
        const total = store.ratings.reduce((acc, curr) => acc + curr.value, 0);
        overallRating = (total / store.ratings.length).toFixed(1);
      }
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating
      };
    });

    res.status(200).json(formattedStores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Error fetching stores' });
  }
};

module.exports = {
  getDashboardStats,
  addUser,
  addStore,
  getUsers,
  getStores
};

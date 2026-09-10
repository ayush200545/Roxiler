const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const {
  validateUserData,
  validateStoreData,
  textContains,
  sortDirection,
  compareValues
} = require('../utils/validation');

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

    const validationError = validateUserData(name, email, password, address, { role });
    if (validationError) {
      return res.status(400).json({ message: validationError });
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
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true
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

    const validationError = validateStoreData(name, email, address);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const parsedOwnerId = parseInt(ownerId, 10);
    if (!parsedOwnerId) {
      return res.status(400).json({ message: 'A store owner is required' });
    }

    const owner = await prisma.user.findUnique({ where: { id: parsedOwnerId } });
    if (!owner || owner.role !== 'STORE_OWNER') {
      return res.status(400).json({ message: 'Invalid owner ID or user is not a STORE_OWNER' });
    }

    const existingStore = await prisma.store.findUnique({ where: { ownerId: parsedOwnerId } });
    if (existingStore) {
      return res.status(400).json({ message: 'This store owner already has a store assigned' });
    }

    const newStore = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: parsedOwnerId
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
    if (name) where.name = textContains(name);
    if (email) where.email = textContains(email);
    if (address) where.address = textContains(address);
    if (role) where.role = role;

    const dbSortFields = ['name', 'email', 'address', 'role'];
    const orderBy = dbSortFields.includes(sortBy)
      ? { [sortBy]: sortDirection(order) }
      : { createdAt: 'desc' };

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
            name: true,
            ratings: { select: { value: true } }
          }
        }
      }
    });

    const formattedUsers = users.map(user => {
      let storeRating = null;
      if (user.role === 'STORE_OWNER' && user.store && user.store.ratings.length > 0) {
        const total = user.store.ratings.reduce((acc, curr) => acc + curr.value, 0);
        storeRating = (total / user.store.ratings.length).toFixed(1);
      }
      const { store, ...userData } = user;
      return {
        ...userData,
        storeName: store?.name || null,
        storeRating
      };
    });

    if (sortBy === 'storeRating' || sortBy === 'rating') {
      formattedUsers.sort((a, b) =>
        compareValues(
          a.storeRating == null ? null : Number(a.storeRating),
          b.storeRating == null ? null : Number(b.storeRating),
          sortDirection(order)
        )
      );
    }

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, order } = req.query;

    const where = {};
    if (name) where.name = textContains(name);
    if (email) where.email = textContains(email);
    if (address) where.address = textContains(address);

    const dbSortFields = ['name', 'email', 'address'];
    const orderBy = dbSortFields.includes(sortBy)
      ? { [sortBy]: sortDirection(order) }
      : { createdAt: 'desc' };

    const stores = await prisma.store.findMany({
      where,
      orderBy,
      include: {
        ratings: true,
        owner: {
          select: { id: true, name: true, email: true }
        }
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
        ownerId: store.ownerId,
        ownerName: store.owner?.name || null,
        overallRating
      };
    });

    if (sortBy === 'rating' || sortBy === 'overallRating') {
      formattedStores.sort((a, b) =>
        compareValues(Number(a.overallRating), Number(b.overallRating), sortDirection(order))
      );
    }

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

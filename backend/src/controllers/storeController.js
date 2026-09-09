const prisma = require('../config/db');

// --- Normal User Endpoints ---

const getAllStores = async (req, res) => {
  try {
    const { name, address, sortBy, order } = req.query;
    const userId = req.user.id; // from authMiddleware

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
      let userRating = null;

      if (store.ratings.length > 0) {
        const total = store.ratings.reduce((acc, curr) => acc + curr.value, 0);
        overallRating = (total / store.ratings.length).toFixed(1);
        
        // Find if the current user has rated this store
        const existingRating = store.ratings.find(r => r.userId === userId);
        if (existingRating) {
          userRating = existingRating.value;
        }
      }

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating,
        userRating // User's submitted rating, if any
      };
    });

    res.status(200).json(formattedStores);
  } catch (error) {
    console.error('Error fetching stores for normal user:', error);
    res.status(500).json({ message: 'Error fetching stores' });
  }
};

const submitOrUpdateRating = async (req, res) => {
  try {
    const storeId = parseInt(req.params.id);
    const userId = req.user.id;
    const { value } = req.body;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId
        }
      }
    });

    let rating;
    if (existingRating) {
      // Modify rating
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { value }
      });
      return res.status(200).json({ message: 'Rating updated successfully', rating });
    } else {
      // Create new rating
      rating = await prisma.rating.create({
        data: {
          value,
          userId,
          storeId
        }
      });
      return res.status(201).json({ message: 'Rating submitted successfully', rating });
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Error submitting rating' });
  }
};

module.exports = {
  getAllStores,
  submitOrUpdateRating
};

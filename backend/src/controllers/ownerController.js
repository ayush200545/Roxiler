const prisma = require('../config/db');

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id; // From auth middleware

    // Fetch the store belonging to this owner, including the ratings and the users who made them
    const store = await prisma.store.findUnique({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found for this owner.' });
    }

    let averageRating = 0;
    if (store.ratings.length > 0) {
      const total = store.ratings.reduce((acc, curr) => acc + curr.value, 0);
      averageRating = (total / store.ratings.length).toFixed(1);
    }

    const ratedUsers = store.ratings.map(rating => ({
      name: rating.user.name,
      email: rating.user.email,
      ratingValue: rating.value,
      date: rating.createdAt
    }));

    res.status(200).json({
      storeName: store.name,
      averageRating,
      totalRatings: store.ratings.length,
      ratedUsers
    });
  } catch (error) {
    console.error('Error fetching owner dashboard:', error);
    res.status(500).json({ message: 'Error fetching owner dashboard data' });
  }
};

module.exports = {
  getOwnerDashboard
};

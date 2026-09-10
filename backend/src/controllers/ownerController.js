const prisma = require('../config/db');
const { sortDirection, compareValues } = require('../utils/validation');

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { sortBy, order } = req.query;

    const store = await prisma.store.findUnique({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                address: true
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
      address: rating.user.address,
      ratingValue: rating.value,
      date: rating.createdAt
    }));

    const sortableFields = {
      name: (row) => row.name,
      email: (row) => row.email,
      ratingValue: (row) => row.ratingValue,
      rating: (row) => row.ratingValue,
      date: (row) => new Date(row.date).getTime()
    };

    if (sortBy && sortableFields[sortBy]) {
      const getter = sortableFields[sortBy];
      ratedUsers.sort((a, b) => compareValues(getter(a), getter(b), sortDirection(order)));
    }

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

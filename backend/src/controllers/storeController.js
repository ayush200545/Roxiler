const prisma = require('../config/db');
const { textContains, sortDirection, compareValues } = require('../utils/validation');

const getAllStores = async (req, res) => {
  try {
    const { name, address, q, sortBy, order } = req.query;
    const userId = req.user.id;

    const where = {};
    if (q) {
      where.OR = [
        { name: textContains(q) },
        { address: textContains(q) }
      ];
    } else {
      if (name) where.name = textContains(name);
      if (address) where.address = textContains(address);
    }

    const dbSortFields = ['name', 'address'];
    const orderBy = dbSortFields.includes(sortBy)
      ? { [sortBy]: sortDirection(order) }
      : { createdAt: 'desc' };

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
        userRating
      };
    });

    if (sortBy === 'rating' || sortBy === 'overallRating') {
      formattedStores.sort((a, b) =>
        compareValues(Number(a.overallRating), Number(b.overallRating), sortDirection(order))
      );
    }

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
    const ratingValue = Number(value);

    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

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
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { value: ratingValue }
      });
      return res.status(200).json({ message: 'Rating updated successfully', rating });
    }

    rating = await prisma.rating.create({
      data: {
        value: ratingValue,
        userId,
        storeId
      }
    });
    return res.status(201).json({ message: 'Rating submitted successfully', rating });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Error submitting rating' });
  }
};

module.exports = {
  getAllStores,
  submitOrUpdateRating
};

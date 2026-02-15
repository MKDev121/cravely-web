// pages/api/search-results.js
import dbConnect from '../../lib/db';
import { Dish, Restaurant, Offer } from '../../lib/schemas';

export default async function handler(req, res) {
  try {
    await dbConnect();
    if (req.method === 'GET') {
      // Fetch all dishes with their restaurant info
      const dishes = await Dish.find({}).populate('restaurantId').lean();

      // Fetch active offers keyed by restaurantId
      const activeOffers = await Offer.find({ isActive: true, endTime: { $gte: new Date() } }).lean();
      const offerMap = {};
      activeOffers.forEach((o) => {
        offerMap[o.restaurantId.toString()] = o.title;
      });

      // Transform to the shape the frontend expects
      const results = dishes.map((d) => ({
        _id: d._id,
        name: d.restaurantId?.name || 'Unknown Restaurant',
        dish: d.name,
        price: `\u20B9${d.price}`,
        rating: d.averageRating?.toFixed(1) || '0.0',
        reviews: `${d.totalReviews || 0} reviews`,
        distance: '—',
        category: d.category || '',
        offer: offerMap[d.restaurantId?._id?.toString()] || null,
      }));

      res.status(200).json(results);
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('API /search-results error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

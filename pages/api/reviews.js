// pages/api/reviews.js
import dbConnect from '../../lib/db';
import { Review } from '../../lib/schemas';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    const reviews = await Review.find({});
    res.status(200).json(reviews);
  } else if (req.method === 'POST') {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } else {
    res.status(405).end();
  }
}

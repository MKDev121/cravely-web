// pages/api/offers.js
import dbConnect from '../../lib/db';
import { Offer } from '../../lib/schemas';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    const offers = await Offer.find({});
    res.status(200).json(offers);
  } else if (req.method === 'POST') {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } else {
    res.status(405).end();
  }
}

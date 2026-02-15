/**
 * seed.js — Connects to MongoDB, creates all collections with
 * indexes, and inserts sample data so you can view them in Compass.
 *
 * Run:  node scripts/seed.js
 */

require('dotenv').config();          // loads .env at project root
const mongoose = require('mongoose');

// ─── Import models ───────────────────────────────────────────────
const {
  User,
  Restaurant,
  Dish,
  Review,
  Offer,
  Reward,
  Redemption,
} = require('../lib/schemas');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not defined in .env');
  process.exit(1);
}

async function seed() {
  console.log('🔗  Connecting to', MONGODB_URI, '...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected!\n');

  // ──────────────────────────────────────────────
  // 0. Drop existing data (optional — keeps re-runs clean)
  // ──────────────────────────────────────────────
  const collections = await mongoose.connection.db.listCollections().toArray();
  const existing = collections.map((c) => c.name);

  for (const name of existing) {
    await mongoose.connection.db.dropCollection(name);
    console.log(`   🗑️  Dropped collection: ${name}`);
  }
  console.log('');

  // ──────────────────────────────────────────────
  // 1. Users
  // ──────────────────────────────────────────────
  const users = await User.insertMany([
    {
      name: 'Meet Kareliya',
      email: 'meet@example.com',
      college: 'VIT Vellore',
      points: 120,
      totalReviews: 8,
      totalUpvotes: 25,
      totalPhotos: 4,
    },
    {
      name: 'Priya Patel',
      email: 'priya@example.com',
      college: 'BITS Pilani',
      points: 85,
      totalReviews: 5,
      totalUpvotes: 12,
      totalPhotos: 2,
    },
    {
      name: 'Rohan Mehta',
      email: 'rohan@example.com',
      college: 'NIT Trichy',
      points: 45,
      totalReviews: 3,
      totalUpvotes: 6,
      totalPhotos: 1,
    },
  ]);
  console.log(`👤  Inserted ${users.length} users`);

  // ──────────────────────────────────────────────
  // 2. Restaurants
  // ──────────────────────────────────────────────
  const restaurants = await Restaurant.insertMany([
    {
      name: 'Spice Junction',
      address: '12 MG Road, Delhi',
      location: { type: 'Point', coordinates: [77.2090, 28.6139] },
    },
    {
      name: 'The Curry Leaf',
      address: '5 Anna Salai, Chennai',
      location: { type: 'Point', coordinates: [80.2707, 13.0827] },
    },
    {
      name: 'Biryani Blues',
      address: '23 Banjara Hills, Hyderabad',
      location: { type: 'Point', coordinates: [78.4867, 17.3850] },
    },
  ]);
  console.log(`🍽️  Inserted ${restaurants.length} restaurants`);

  // ──────────────────────────────────────────────
  // 3. Dishes
  // ──────────────────────────────────────────────
  const dishes = await Dish.insertMany([
    {
      name: 'Butter Chicken',
      price: 280,
      averageRating: 4.5,
      totalReviews: 3,
      category: 'Main Course',
      restaurantId: restaurants[0]._id,
    },
    {
      name: 'Masala Dosa',
      price: 120,
      averageRating: 4.2,
      totalReviews: 2,
      category: 'Breakfast',
      restaurantId: restaurants[1]._id,
    },
    {
      name: 'Hyderabadi Biryani',
      price: 320,
      averageRating: 4.8,
      totalReviews: 5,
      category: 'Main Course',
      restaurantId: restaurants[2]._id,
    },
    {
      name: 'Paneer Tikka',
      price: 200,
      averageRating: 4.0,
      totalReviews: 1,
      category: 'Starters',
      restaurantId: restaurants[0]._id,
    },
    {
      name: 'Gulab Jamun',
      price: 80,
      averageRating: 4.6,
      totalReviews: 2,
      category: 'Dessert',
      restaurantId: restaurants[1]._id,
    },
  ]);
  console.log(`🍛  Inserted ${dishes.length} dishes`);

  // ──────────────────────────────────────────────
  // 4. Reviews
  // ──────────────────────────────────────────────
  const reviews = await Review.insertMany([
    {
      userId: users[0]._id,
      dishId: dishes[0]._id,
      restaurantId: restaurants[0]._id,
      rating: 5,
      text: 'Best butter chicken I have ever had! Creamy and perfectly spiced.',
      tags: ['creamy', 'spicy', 'must-try'],
      photos: [],
      upvotes: 10,
      upvotedBy: [users[1]._id, users[2]._id],
    },
    {
      userId: users[1]._id,
      dishId: dishes[1]._id,
      restaurantId: restaurants[1]._id,
      rating: 4,
      text: 'Crispy dosa with amazing chutney. Slightly oily though.',
      tags: ['crispy', 'south-indian'],
      photos: [],
      upvotes: 5,
      upvotedBy: [users[0]._id],
    },
    {
      userId: users[2]._id,
      dishId: dishes[2]._id,
      restaurantId: restaurants[2]._id,
      rating: 5,
      text: 'Authentic Hyderabadi biryani — the flavour is out of this world!',
      tags: ['biryani', 'authentic', 'flavourful'],
      photos: [],
      upvotes: 8,
      upvotedBy: [users[0]._id, users[1]._id],
    },
    {
      userId: users[0]._id,
      dishId: dishes[4]._id,
      restaurantId: restaurants[1]._id,
      rating: 4,
      text: 'Soft and sweet gulab jamun. Classic dessert done right.',
      tags: ['sweet', 'dessert'],
      photos: [],
      upvotes: 3,
      upvotedBy: [users[2]._id],
    },
  ]);
  console.log(`📝  Inserted ${reviews.length} reviews`);

  // ──────────────────────────────────────────────
  // 5. Offers
  // ──────────────────────────────────────────────
  const now = new Date();
  const offers = await Offer.insertMany([
    {
      restaurantId: restaurants[0]._id,
      title: '20% off on all starters!',
      description: 'Valid on dine-in orders above ₹500.',
      startTime: now,
      endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 days
      isActive: true,
      maxClaims: 100,
      currentClaims: 12,
    },
    {
      restaurantId: restaurants[2]._id,
      title: 'Buy 1 Get 1 Biryani',
      description: 'Weekday lunch special — Mon to Fri, 12-3 PM.',
      startTime: now,
      endTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // +14 days
      isActive: true,
      maxClaims: 50,
      currentClaims: 5,
    },
  ]);
  console.log(`🎉  Inserted ${offers.length} offers`);

  // ──────────────────────────────────────────────
  // 6. Rewards
  // ──────────────────────────────────────────────
  const rewards = await Reward.insertMany([
    {
      title: 'Free Dessert',
      description: 'Redeem for any dessert item at partner restaurants.',
      pointsCost: 50,
      isActive: true,
    },
    {
      title: '₹100 Discount Coupon',
      description: 'Flat ₹100 off on your next order.',
      pointsCost: 100,
      isActive: true,
    },
    {
      title: 'Exclusive Tasting Event',
      description: 'Access to a chef-curated tasting session.',
      pointsCost: 250,
      isActive: true,
    },
  ]);
  console.log(`🏆  Inserted ${rewards.length} rewards`);

  // ──────────────────────────────────────────────
  // 7. Redemptions
  // ──────────────────────────────────────────────
  const redemptions = await Redemption.insertMany([
    {
      userId: users[0]._id,
      rewardId: rewards[0]._id,
      pointsSpent: 50,
      redeemedAt: new Date(),
    },
    {
      userId: users[1]._id,
      rewardId: rewards[1]._id,
      pointsSpent: 100,
      redeemedAt: new Date(),
    },
  ]);
  console.log(`🎁  Inserted ${redemptions.length} redemptions`);

  // ──────────────────────────────────────────────
  // 8. Sync indexes (ensures 2dsphere, text, unique, etc.)
  // ──────────────────────────────────────────────
  console.log('\n📇  Syncing indexes...');
  await User.syncIndexes();
  await Restaurant.syncIndexes();
  await Dish.syncIndexes();
  await Review.syncIndexes();
  await Offer.syncIndexes();
  await Reward.syncIndexes();
  await Redemption.syncIndexes();
  console.log('✅  Indexes synced!');

  // ──────────────────────────────────────────────
  // Done
  // ──────────────────────────────────────────────
  console.log('\n🎯  Seed complete! Open MongoDB Compass and connect to:');
  console.log(`    ${MONGODB_URI}`);
  console.log('    You should see the "Cravely" database with 7 collections.\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});

import 'dotenv/config';
import mongoose from 'mongoose';
import Order from './src/models/Order.model.js';

const seedReturns = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  
  // Find a few delivered orders
  const orders = await Order.find({ orderStatus: 'delivered' }).limit(3);
  
  for (const order of orders) {
    if (order.items.length > 0) {
      order.items[0].returnStatus = 'requested';
      order.items[0].returnReason = 'Item was damaged';
      order.items[0].returnRequestDate = new Date();
      await order.save();
    }
  }
  
  console.log('Returns seeded.');
  process.exit(0);
};

seedReturns();

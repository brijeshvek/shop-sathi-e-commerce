import 'dotenv/config';
import connectDB from './src/config/db.js';
import User from './src/models/User.model.js';
import bcrypt from 'bcryptjs';

await connectDB();

const hash = await bcrypt.hash('password123', 12);

// Reset all seed users
const result = await User.updateMany(
  {},
  { $set: { password: hash } }
);
console.log('Password reset for', result.modifiedCount, 'users total');

// Verify each
const users = await User.find({ email: { $in: ['customer1@example.com', 'seller1@example.com'] } }).select('+password');
for (const u of users) {
  const ok = await bcrypt.compare('password123', u.password);
  console.log(`  ${u.email} (${u.role}): ${ok ? '✅ OK' : '❌ FAIL'}`);
}

process.exit(0);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';
import Review from '../models/Review.model.js';

dotenv.config();

const mockReviewsData = [
  { rating: 5, title: "Excellent Product!", comment: "Really satisfied with the build quality and performance. Worth every rupee!" },
  { rating: 5, title: "Outstanding quality", comment: "Exceeded my expectations. Packaging was great and delivery was fast. Highly recommend." },
  { rating: 4, title: "Very Good Purchase", comment: "Good value for money. Works perfectly and looks great. Satisfied with the service." },
  { rating: 4, title: "Great value", comment: "Exactly as described in features. Works fine, shipping was fast, overall excellent experience." },
  { rating: 3, title: "Decent product", comment: "Average quality product. Works as expected but the delivery was slightly delayed." }
];

async function seedReviews() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined.");
      process.exit(1);
    }

    console.log("Connecting to database...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    // Ensure we have at least 5 mock reviewer users in the DB
    const reviewers = [];
    for (let i = 1; i <= 5; i++) {
      const email = `reviewer${i}@shopshathi.com`;
      let user = await User.findOne({ email });
      if (!user) {
        // Generate random unique phone to prevent duplicate key errors
        const phone = `9` + Math.floor(100000000 + Math.random() * 900000000);
        user = await User.create({
          name: `Customer Reviewer ${i}`,
          email,
          phone,
          password: 'Password123!',
          role: 'customer',
          isVerified: true
        });
        console.log(`Created reviewer user: ${email} with phone ${phone}`);
      }
      reviewers.push(user);
    }

    const products = await Product.find({});
    console.log(`Found ${products.length} products to seed reviews for...`);

    let totalReviewsCreated = 0;

    for (const product of products) {
      const existingReviews = await Review.find({ product: product._id });
      const currentCount = existingReviews.length;

      if (currentCount < 5) {
        const needed = 5 - currentCount;
        
        for (let idx = 0; idx < needed; idx++) {
          const reviewerUser = reviewers[(currentCount + idx) % reviewers.length];
          const reviewData = mockReviewsData[idx % mockReviewsData.length];

          try {
            await Review.deleteOne({ product: product._id, user: reviewerUser._id });

            await Review.create({
              product: product._id,
              user: reviewerUser._id,
              rating: reviewData.rating,
              title: reviewData.title,
              comment: reviewData.comment,
              isVerifiedPurchase: true
            });
            totalReviewsCreated++;
          } catch (err) {
            console.error(`Failed to create review for product ${product.name}:`, err.message);
          }
        }
      }
    }

    console.log(`Successfully created/ensured 5 reviews per product. Total new reviews added: ${totalReviewsCreated}`);

  } catch (error) {
    console.error("Operation failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedReviews();

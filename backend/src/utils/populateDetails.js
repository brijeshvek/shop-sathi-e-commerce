import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';

dotenv.config();

async function populateDetails() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined.");
      process.exit(1);
    }

    console.log("Connecting to database...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    const products = await Product.find({}).populate('category');
    console.log(`Found ${products.length} products to check...`);

    let updatedCount = 0;

    for (const product of products) {
      let needsUpdate = false;

      // 1. Check features
      if (!product.features || product.features.length === 0) {
        const catName = product.category?.name || 'Product';
        product.features = [
          `Premium quality ${product.brand || catName} product`,
          `Designed for maximum durability and long-term usage`,
          `Ergonomic design with modern aesthetic appeal`,
          `Rigorous quality checks passed for superior performance`,
          `Great value for money with reliable support`
        ];
        needsUpdate = true;
      }

      // 2. Check specifications
      if (!product.specifications || product.specifications.length === 0) {
        product.specifications = [
          { key: 'Brand', value: product.brand || 'Generic' },
          { key: 'Model Number', value: product.modelNumber || product.sku || 'N/A' },
          { key: 'Condition', value: 'New' },
          { key: 'Quality Grade', value: 'Premium' },
          { key: 'Ideal For', value: 'Daily Use' }
        ];
        needsUpdate = true;
      }

      // 3. Set default return Policy if empty
      if (!product.returnPolicy || (!product.returnPolicy.isReturnable && !product.returnPolicy.isExchangeable)) {
        product.returnPolicy = {
          isReturnable: true,
          returnDays: 7,
          isExchangeable: true,
          exchangeDays: 7
        };
        needsUpdate = true;
      }

      // 4. Set default shipping if empty
      if (!product.shipping || !product.shipping.deliveryTimeDays) {
        product.shipping = {
          weight: product.dimensions?.weight || 500,
          deliveryTimeDays: 4,
          freeShipping: true,
          codAvailable: true
        };
        needsUpdate = true;
      }

      // 5. Set warranty if empty
      if (!product.warranty || product.warranty.type === 'No Warranty') {
        product.warranty = {
          period: '1 Year',
          type: 'Brand Warranty',
          replacementPolicy: 'Easy replacement within return window'
        };
        needsUpdate = true;
      }

      if (needsUpdate) {
        await product.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated details for ${updatedCount} products!`);

  } catch (error) {
    console.error("Operation failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

populateDetails();

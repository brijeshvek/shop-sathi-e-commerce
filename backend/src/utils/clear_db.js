import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function clearDb() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI environment variable is not defined in .env file.");
      process.exit(1);
    }
    
    console.log("Connecting to database Cluster...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");
    
    const db = mongoose.connection.db;
    
    console.log("Dropping products collection data...");
    const productsRes = await db.collection('products').deleteMany({});
    console.log(`Deleted ${productsRes.deletedCount} products.`);
    
    console.log("Dropping categories collection data...");
    const categoriesRes = await db.collection('categories').deleteMany({});
    console.log(`Deleted ${categoriesRes.deletedCount} categories.`);
    
    console.log("Database products and categories successfully cleared!");
  } catch (error) {
    console.error("Error occurred while clearing database:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

clearDb();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const SPORTS_PRODUCTS = [
  {
    name: "Bowflex SelectTech 552 Adjustable Dumbbells",
    description: "Adjustable dumbbell set that replaces 15 sets of weights, easily switching from 5 to 52.5 pounds with the turn of a dial.",
    shortDescription: "Adjustable 5 to 52.5 lb dumbbell set.",
    price: 35000,
    originalPrice: 42900,
    brand: "Bowflex",
    sku: "BOW-ST552-DB",
    images: [{ url: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 25,
    isFeatured: true,
    tags: ["dumbbells", "gym", "weights", "strength"],
    categoryName: "Gym Equipment"
  },
  {
    name: "CAP Barbell Cast Iron Hex Dumbbell, 25 lbs",
    description: "Solid cast iron dumbbell with a hexagonal design to prevent rolling and provide stability for exercises.",
    shortDescription: "25 lb solid cast iron hex dumbbell.",
    price: 3500,
    originalPrice: 4000,
    brand: "CAP Barbell",
    sku: "CAP-HEX-25LB",
    images: [{ url: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 60,
    tags: ["dumbbell", "weights", "iron", "gym"],
    categoryName: "Gym Equipment"
  },
  {
    name: "Manduka PRO Yoga Mat",
    description: "Ultra-dense and spacious performance yoga mat that has unmatched comfort and cushioning.",
    shortDescription: "Premium 6mm high-density yoga mat.",
    price: 10500,
    originalPrice: 12000,
    brand: "Manduka",
    sku: "MAN-PRO-MAT-BLK",
    images: [{ url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 45,
    isFeatured: true,
    tags: ["yoga", "mat", "manduka", "fitness"],
    categoryName: "Yoga Equipment"
  },
  {
    name: "Gaiam Yoga Block (Set of 2)",
    description: "Lightweight and supportive foam blocks for deeper stretches, better balance, and perfect alignment.",
    shortDescription: "Supportive foam yoga blocks (2-pack).",
    price: 1500,
    originalPrice: 1999,
    brand: "Gaiam",
    sku: "GAI-BLOCK-2PK",
    images: [{ url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80", isMain: true }], // general yoga visual
    stock: 120,
    tags: ["yoga", "block", "stretching", "accessories"],
    categoryName: "Yoga Equipment"
  },
  {
    name: "Wilson Evolution Indoor Game Basketball",
    description: "The #1 indoor basketball in America, featuring a Micro-Touch Cover for exceptional grip and feel.",
    shortDescription: "Premium composite leather indoor basketball.",
    price: 5999,
    originalPrice: 6500,
    brand: "Wilson",
    sku: "WIL-EVO-BB-SZ7",
    images: [{ url: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 55,
    tags: ["basketball", "sports", "wilson", "indoor"],
    categoryName: "Sports Gear"
  },
  {
    name: "Spalding NBA Street Basketball",
    description: "Durable outdoor basketball designed with an outdoor rubber cover for concrete or asphalt courts.",
    shortDescription: "Durable outdoor street basketball.",
    price: 1499,
    originalPrice: 1999,
    brand: "Spalding",
    sku: "SPL-NBA-STR",
    images: [{ url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 80,
    tags: ["basketball", "outdoor", "spalding", "sports"],
    categoryName: "Sports Gear"
  },
  {
    name: "Garmin Forerunner 245 Music",
    description: "GPS running smartwatch with advanced training features and music storage for phone-free listening.",
    shortDescription: "GPS running watch with music storage.",
    price: 29900,
    originalPrice: 32900,
    brand: "Garmin",
    sku: "GAR-FR245-MUS",
    images: [{ url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 35,
    isFeatured: true,
    tags: ["smartwatch", "running", "garmin", "gps"],
    categoryName: "Cycling & Running"
  },
  {
    name: "Schwinn Fitness Indoor Cycling Exercise Bike",
    description: "High-performance indoor cycling bike designed with a 40 lb flywheel and adjustable resistance.",
    shortDescription: "Adjustable resistance indoor cycling bike.",
    price: 65000,
    originalPrice: 75000,
    brand: "Schwinn",
    sku: "SCH-IC4-BIKE",
    images: [{ url: "https://images.unsplash.com/photo-1598466106689-53e34b5b4816?auto=format&fit=crop&w=800&q=80", isMain: true }], // general indoor bike visual
    stock: 15,
    tags: ["bike", "cycling", "cardio", "indoor"],
    categoryName: "Cycling & Running"
  },
  {
    name: "Fit Simplify Resistance Loop Exercise Bands",
    description: "Set of 5 premium quality, 100% natural latex resistance bands for stretching, strength training, and physical therapy.",
    shortDescription: "Set of 5 latex resistance bands.",
    price: 999,
    originalPrice: 1499,
    brand: "Fit Simplify",
    sku: "FS-RES-BANDS-5",
    images: [{ url: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80", isMain: true }], // general fitness visual
    stock: 200,
    tags: ["bands", "resistance", "workout", "accessories"],
    categoryName: "Fitness Accessories"
  },
  {
    name: "TRX GO Suspension Training System",
    description: "Lightweight and portable bodyweight fitness resistance training system for full-body workouts anywhere.",
    shortDescription: "Portable bodyweight suspension trainer.",
    price: 10500,
    originalPrice: 11900,
    brand: "TRX",
    sku: "TRX-GO-SUSP",
    images: [{ url: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=800&q=80", isMain: true }], // general trx/gym visual
    stock: 40,
    tags: ["trx", "suspension", "workout", "fitness"],
    categoryName: "Fitness Accessories"
  }
];

async function addSportsProducts() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined.");
      process.exit(1);
    }

    console.log("Connecting to database...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    let user = await User.findOne({ role: { $in: ['admin', 'superadmin', 'seller'] } });
    if (!user) {
      console.log("No user found. Please ensure there is at least one admin/seller user.");
      process.exit(1);
    }

    console.log("Adding Sports & Fitness Products...");
    
    let addedCount = 0;
    
    for (const prodData of SPORTS_PRODUCTS) {
      const category = await Category.findOne({ name: prodData.categoryName });
      
      if (!category) {
        console.warn(`Category not found for product: ${prodData.name} (${prodData.categoryName}). Ensure categories exist. Skipping.`);
        continue;
      }

      await Product.create({
        name: prodData.name,
        description: prodData.description,
        shortDescription: prodData.shortDescription,
        price: prodData.price,
        originalPrice: prodData.originalPrice,
        brand: prodData.brand,
        sku: prodData.sku,
        images: prodData.images,
        stock: prodData.stock,
        isFeatured: prodData.isFeatured || false,
        tags: prodData.tags || [],
        specifications: prodData.specifications || [],
        attributes: prodData.attributes || {},
        dimensions: prodData.dimensions || {},
        certifications: prodData.certifications || {},
        warranty: prodData.warranty || {},
        shipping: prodData.shipping || {},
        category: category._id,
        createdBy: user._id,
        seller: user._id
      });
      console.log(`Added: ${prodData.name}`);
      addedCount++;
    }

    console.log(`Successfully added ${addedCount} products.`);
  } catch (error) {
    console.error("Operation failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

addSportsProducts();

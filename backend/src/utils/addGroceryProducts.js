import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const GROCERY_PRODUCTS = [
  {
    name: "Fresh Organic Bananas (1 Bunch)",
    description: "Naturally sweet, organic bananas, perfect for a quick snack, baking, or adding to your morning cereal.",
    shortDescription: "Fresh organic sweet bananas.",
    price: 150,
    originalPrice: 180,
    brand: "Fresh Farm",
    sku: "GRO-FMT-BAN-ORG",
    images: [{ url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 200,
    isFeatured: true,
    tags: ["fruits", "bananas", "organic", "fresh"],
    categoryName: "Fruits & Vegetables"
  },
  {
    name: "Hass Avocados (Pack of 4)",
    description: "Creamy and rich Hass avocados, packed with healthy fats, ideal for guacamole, salads, and toasts.",
    shortDescription: "Pack of 4 creamy Hass avocados.",
    price: 299,
    originalPrice: 350,
    brand: "Fresh Farm",
    sku: "GRO-FMT-AVO-4PK",
    images: [{ url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 150,
    tags: ["vegetables", "avocado", "healthy", "fresh"],
    categoryName: "Fruits & Vegetables"
  },
  {
    name: "Amul Pure Ghee 1L (Pouch)",
    description: "Rich, aromatic, and pure cow ghee packed with essential nutrients, perfect for everyday cooking and sweet dishes.",
    shortDescription: "1L Pure Cow Ghee.",
    price: 650,
    originalPrice: 700,
    brand: "Amul",
    sku: "GRO-DRY-AMUL-GHEE",
    images: [{ url: "https://images.unsplash.com/photo-1627444312702-861c8a1496a7?auto=format&fit=crop&w=800&q=80", isMain: true }], // General cooking oil/ghee visual
    stock: 100,
    isFeatured: true,
    tags: ["dairy", "ghee", "amul", "cooking"],
    categoryName: "Dairy Products"
  },
  {
    name: "Organic Whole Milk (1 Gallon)",
    description: "Farm-fresh organic whole milk, pasteurized and homogenized for a creamy and delicious taste.",
    shortDescription: "1 Gallon Organic Whole Milk.",
    price: 350,
    originalPrice: 400,
    brand: "Horizon Organic",
    sku: "GRO-DRY-MILK-1G",
    images: [{ url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 120,
    tags: ["milk", "dairy", "organic", "beverage"],
    categoryName: "Dairy Products"
  },
  {
    name: "Lay's Classic Potato Chips (Family Size)",
    description: "Perfectly crispy and perfectly salted, these classic potato chips are a timeless favorite for any gathering.",
    shortDescription: "Family size classic salted potato chips.",
    price: 150,
    originalPrice: 199,
    brand: "Lay's",
    sku: "GRO-SNK-LAYS-CLS",
    images: [{ url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 250,
    tags: ["snacks", "chips", "lays", "crisps"],
    categoryName: "Snacks & Beverages"
  },
  {
    name: "Coca-Cola Original Taste (12-Pack Cans)",
    description: "The classic, refreshing taste of Coca-Cola in convenient 12 oz cans, perfect to share with friends and family.",
    shortDescription: "12-pack of 12 oz Coca-Cola cans.",
    price: 499,
    originalPrice: 599,
    brand: "Coca-Cola",
    sku: "GRO-BEV-COKE-12PK",
    images: [{ url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 180,
    tags: ["beverage", "soda", "coke", "coca-cola"],
    categoryName: "Snacks & Beverages"
  },
  {
    name: "Royal Basmati Rice (10 lbs)",
    description: "Premium, long-grain basmati rice aged to perfection, offering a delightful aroma and fluffy texture.",
    shortDescription: "10 lbs premium aged basmati rice.",
    price: 1299,
    originalPrice: 1599,
    brand: "Royal",
    sku: "GRO-RCE-BAS-10LBS",
    images: [{ url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 85,
    isFeatured: true,
    tags: ["rice", "basmati", "grains", "pantry"],
    categoryName: "Rice & Grains"
  },
  {
    name: "Organic White Quinoa (2 lbs)",
    description: "Nutrient-dense organic white quinoa, a versatile and healthy gluten-free alternative to rice.",
    shortDescription: "2 lbs organic white quinoa.",
    price: 699,
    originalPrice: 899,
    brand: "Viva Naturals",
    sku: "GRO-GRN-QNA-2LBS",
    images: [{ url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80", isMain: true }], // General grains visual
    stock: 90,
    tags: ["quinoa", "grains", "organic", "healthy"],
    categoryName: "Rice & Grains"
  },
  {
    name: "Filippo Berio Extra Virgin Olive Oil (500ml)",
    description: "Cold-pressed extra virgin olive oil with a distinctively rich taste, ideal for dressings, marinades, and dipping.",
    shortDescription: "500ml Cold-pressed Extra Virgin Olive Oil.",
    price: 899,
    originalPrice: 1099,
    brand: "Filippo Berio",
    sku: "GRO-OIL-EVOO-500",
    images: [{ url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 130,
    tags: ["oil", "olive oil", "cooking", "pantry"],
    categoryName: "Spices & Oils"
  },
  {
    name: "Himalayan Pink Salt Fine Grain (1 lb)",
    description: "100% natural, pure Himalayan pink salt fine grain, packed with trace minerals for everyday cooking and baking.",
    shortDescription: "1 lb fine grain Himalayan pink salt.",
    price: 399,
    originalPrice: 499,
    brand: "Spice Island",
    sku: "GRO-SPC-HSLT-1LB",
    images: [{ url: "https://images.unsplash.com/photo-1627444312702-861c8a1496a7?auto=format&fit=crop&w=800&q=80", isMain: true }], // general spice/salt visual
    stock: 160,
    tags: ["salt", "spices", "himalayan", "pantry"],
    categoryName: "Spices & Oils"
  }
];

async function addGroceryProducts() {
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

    console.log("Adding Grocery & Essentials Products...");
    
    let addedCount = 0;
    
    for (const prodData of GROCERY_PRODUCTS) {
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

addGroceryProducts();

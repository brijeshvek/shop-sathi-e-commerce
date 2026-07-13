import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const SEASONAL_PRODUCTS = [
  {
    name: "Columbia Men's Watertight II Jacket",
    description: "Top-notch rain protection in an ultralight package. This waterproof, breathable rain jacket packs down into its own hand pocket.",
    shortDescription: "Waterproof, breathable, packable rain jacket.",
    price: 6999,
    originalPrice: 8999,
    brand: "Columbia",
    sku: "SEA-WIN-COL-JKT",
    images: [{ url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 75,
    isFeatured: true,
    tags: ["jacket", "raincoat", "monsoon", "columbia"],
    categoryName: "Winter Collection"
  },
  {
    name: "The North Face Men's McMurdo Parka",
    description: "Windproof, waterproof and breathable heavy-duty parka. Insulated with 550-fill down for exceptional warmth in harsh winter conditions.",
    shortDescription: "Heavy-duty waterproof winter parka.",
    price: 29900,
    originalPrice: 34900,
    brand: "The North Face",
    sku: "SEA-WIN-TNF-PRK",
    images: [{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 45,
    tags: ["parka", "winter", "jacket", "the north face"],
    categoryName: "Winter Collection"
  },
  {
    name: "Ray-Ban Classic Aviator Sunglasses",
    description: "Originally designed for U.S. Aviators, this classic sunglass design features a gold frame and G-15 green lenses for ultimate UV protection.",
    shortDescription: "Classic aviator sunglasses with UV protection.",
    price: 12990,
    originalPrice: 15500,
    brand: "Ray-Ban",
    sku: "SEA-SUM-RB-AVI",
    images: [{ url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 120,
    isFeatured: true,
    tags: ["sunglasses", "summer", "ray-ban", "accessories"],
    categoryName: "Summer Collection"
  },
  {
    name: "UGG Women's Classic Short II Boot",
    description: "Iconic short boots pretreated to repel moisture and stains. Features a plush sheepskin lining and a lightweight, durable sole.",
    shortDescription: "Classic short sheepskin winter boots.",
    price: 14500,
    originalPrice: 16900,
    brand: "UGG",
    sku: "SEA-WIN-UGG-SHRT",
    images: [{ url: "https://images.unsplash.com/photo-1551029285-d72b536abaf5?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 60,
    tags: ["boots", "winter", "ugg", "footwear"],
    categoryName: "Winter Collection"
  },
  {
    name: "Supergoop! Unseen Sunscreen SPF 40",
    description: "A totally invisible, weightless, scentless sunscreen that leaves a velvety finish. Perfect for daily wear under makeup.",
    shortDescription: "Invisible weightless SPF 40 sunscreen.",
    price: 2999,
    originalPrice: 3500,
    brand: "Supergoop!",
    sku: "SEA-SUM-SGOOP-SPF",
    images: [{ url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 150,
    tags: ["sunscreen", "summer", "spf", "skincare"],
    categoryName: "Summer Collection"
  },
  {
    name: "JanSport SuperBreak One Backpack",
    description: "Classic, ultra-lightweight everyday backpack featuring one large main compartment and a front utility pocket with organizer.",
    shortDescription: "Classic durable everyday backpack.",
    price: 2999,
    originalPrice: 3500,
    brand: "JanSport",
    sku: "SEA-BTS-JAN-BP",
    images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 200,
    tags: ["backpack", "school", "college", "bags"],
    categoryName: "Back-to-School"
  },
  {
    name: "Handcrafted Diwali Toran/Door Hanging",
    description: "Beautifully handcrafted traditional Toran to adorn your doorways during the festive season, welcoming prosperity and joy.",
    shortDescription: "Traditional handcrafted festive door hanging.",
    price: 999,
    originalPrice: 1499,
    brand: "Festive Decor",
    sku: "SEA-FST-TRN-HND",
    images: [{ url: "https://images.unsplash.com/photo-1601053183590-7d727cecc07b?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 200,
    tags: ["festive", "decor", "diwali", "toran"],
    categoryName: "Festival Specials"
  },
  {
    name: "Coleman 54-Quart Steel-Belted Cooler",
    description: "Classic steel-belted cooler that keeps ice up to 4 days in temperatures as high as 90°F. Holds up to 85 cans.",
    shortDescription: "54-Quart steel-belted summer cooler.",
    price: 18900,
    originalPrice: 21900,
    brand: "Coleman",
    sku: "SEA-SUM-CLM-CLR",
    images: [{ url: "https://images.unsplash.com/photo-1627479426918-a626fdf24b13?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 30,
    isFeatured: true,
    tags: ["cooler", "summer", "outdoor", "coleman"],
    categoryName: "Summer Collection"
  },
  {
    name: "Texas Instruments TI-84 Plus CE Graphing Calculator",
    description: "High-resolution, full-color backlit display. Familiar TI-84 Plus functionality in a sleek, lightweight design. Perfect for math and science classes.",
    shortDescription: "Full-color backlit graphing calculator.",
    price: 11999,
    originalPrice: 13999,
    brand: "Texas Instruments",
    sku: "SEA-BTS-TI84-CE",
    images: [{ url: "https://images.unsplash.com/photo-1574512918804-03e1e2cfc23e?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 85,
    tags: ["calculator", "math", "school", "electronics"],
    categoryName: "Back-to-School"
  },
  {
    name: "Traditional Festive Kurta Set",
    description: "Elegant and comfortable traditional kurta pajama set, intricately designed for celebrations, pujas, and festive gatherings.",
    shortDescription: "Elegant traditional men's festive kurta set.",
    price: 3499,
    originalPrice: 4500,
    brand: "Festive Threads",
    sku: "SEA-FST-KRT-MNS",
    images: [{ url: "https://images.unsplash.com/photo-1583391733958-d25e77d2e051?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 100,
    tags: ["kurta", "festive", "traditional", "clothing"],
    categoryName: "Festival Specials"
  }
];

async function addSeasonalProducts() {
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

    console.log("Adding Seasonal Collections Products...");
    
    let addedCount = 0;
    
    for (const prodData of SEASONAL_PRODUCTS) {
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

addSeasonalProducts();

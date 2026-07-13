import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const TOYS_PRODUCTS = [
  {
    name: "LEGO Classic Large Creative Brick Box",
    description: "Includes 790 pieces in 33 different colors to build a variety of toys, vehicles, and buildings. A great supplement to any existing LEGO collection.",
    shortDescription: "790-piece creative LEGO brick building set.",
    price: 3999,
    originalPrice: 4500,
    brand: "LEGO",
    sku: "TOY-LGO-CLS-LGBOX",
    images: [{ url: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80", isMain: true }], // General lego visual
    stock: 120,
    isFeatured: true,
    tags: ["lego", "building", "blocks", "educational"],
    categoryName: "Educational Toys"
  },
  {
    name: "Melissa & Doug Wooden Building Blocks Set",
    description: "100-piece solid wood block set in 4 colors and 9 shapes. Ideal for introducing early math concepts and promoting fine motor skills.",
    shortDescription: "100-piece solid wood colorful blocks set.",
    price: 1999,
    originalPrice: 2499,
    brand: "Melissa & Doug",
    sku: "TOY-MD-WOOD-100",
    images: [{ url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80", isMain: true }], // general wooden blocks
    stock: 150,
    tags: ["wooden", "blocks", "toddler", "educational"],
    categoryName: "Educational Toys"
  },
  {
    name: "Catan Board Game",
    description: "The highly acclaimed modern classic board game of discovery, settlement, and trade. For 3 to 4 players.",
    shortDescription: "Classic strategy board game of trade and building.",
    price: 3499,
    originalPrice: 4199,
    brand: "Catan Studio",
    sku: "TOY-BG-CATAN",
    images: [{ url: "https://images.unsplash.com/photo-1611891487122-207578d65414?auto=format&fit=crop&w=800&q=80", isMain: true }], // general board game
    stock: 85,
    isFeatured: true,
    tags: ["board game", "strategy", "family", "catan"],
    categoryName: "Board Games & Puzzles"
  },
  {
    name: "Ticket to Ride Board Game",
    description: "A cross-country train adventure in which players collect and play matching train cards to claim railway routes connecting cities through North America.",
    shortDescription: "Cross-country train adventure board game.",
    price: 3999,
    originalPrice: 4599,
    brand: "Days of Wonder",
    sku: "TOY-BG-TTRIDE",
    images: [{ url: "https://images.unsplash.com/photo-1632501641765-e5e8d7f34c19?auto=format&fit=crop&w=800&q=80", isMain: true }], // general board game 2
    stock: 60,
    tags: ["board game", "strategy", "trains", "family"],
    categoryName: "Board Games & Puzzles"
  },
  {
    name: "Ravensburger 1000 Piece Jigsaw Puzzle",
    description: "High-quality 1000 piece jigsaw puzzle featuring a beautiful landscape. Premium puzzle board and softclick technology for an optimal fit.",
    shortDescription: "Premium 1000-piece landscape jigsaw puzzle.",
    price: 1599,
    originalPrice: 1999,
    brand: "Ravensburger",
    sku: "TOY-PZL-RAV-1000",
    images: [{ url: "https://images.unsplash.com/photo-1503698015523-2868222a7f5a?auto=format&fit=crop&w=800&q=80", isMain: true }], // puzzle pieces visual
    stock: 110,
    tags: ["puzzle", "jigsaw", "1000 pieces", "games"],
    categoryName: "Board Games & Puzzles"
  },
  {
    name: "Marvel Legends Series Iron Man Action Figure",
    description: "6-inch scale collectible Iron Man action figure featuring premium design, detail, and articulation for high poseability.",
    shortDescription: "6-inch premium collectible Iron Man figure.",
    price: 2499,
    originalPrice: 2999,
    brand: "Hasbro",
    sku: "TOY-ACT-IM-6IN",
    images: [{ url: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?auto=format&fit=crop&w=800&q=80", isMain: true }], // iron man figure
    stock: 75,
    tags: ["action figure", "marvel", "iron man", "collectibles"],
    categoryName: "Action Figures & Dolls"
  },
  {
    name: "Barbie Dreamhouse Dollhouse",
    description: "Fully furnished Barbie Dreamhouse with 3 stories, 8 rooms, a pool, a slide, and a working elevator.",
    shortDescription: "3-story Barbie Dreamhouse with pool & elevator.",
    price: 18999,
    originalPrice: 21999,
    brand: "Barbie",
    sku: "TOY-DOLL-BB-DH",
    images: [{ url: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80", isMain: true }], // general dollhouse/doll visual
    stock: 20,
    isFeatured: true,
    tags: ["dollhouse", "barbie", "toys", "girls"],
    categoryName: "Action Figures & Dolls"
  },
  {
    name: "Holy Stone HS110D FPV RC Drone",
    description: "1080P HD Camera Drone with Voice Control, Gesture Control, Altitude Hold, and Gravity Sensor. Perfect for beginners and kids.",
    shortDescription: "Beginner RC drone with 1080P HD camera.",
    price: 5499,
    originalPrice: 6999,
    brand: "Holy Stone",
    sku: "TOY-RC-HS110D",
    images: [{ url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 45,
    tags: ["drone", "rc", "camera", "flying"],
    categoryName: "RC Toys"
  },
  {
    name: "Traxxas Rustler 4X4 VXL RC Truck",
    description: "High-performance brushless RC stadium truck capable of extreme speeds over 65 mph. Waterproof electronics.",
    shortDescription: "High-speed brushless 4X4 RC stadium truck.",
    price: 32900,
    originalPrice: 35000,
    brand: "Traxxas",
    sku: "TOY-RC-TRX-RST4X4",
    images: [{ url: "https://images.unsplash.com/photo-1594912959885-3bcff0c31273?auto=format&fit=crop&w=800&q=80", isMain: true }], // general rc car
    stock: 15,
    isFeatured: true,
    tags: ["rc car", "truck", "traxxas", "racing"],
    categoryName: "RC Toys"
  },
  {
    name: "Magna-Tiles 32-Piece Clear Colors Set",
    description: "The original 3D magnetic building tiles that engage young minds by fusing together math, science, and creativity.",
    shortDescription: "32-Piece 3D magnetic building tiles set.",
    price: 4500,
    originalPrice: 5200,
    brand: "Magna-Tiles",
    sku: "TOY-MAG-32PC",
    images: [{ url: "https://images.unsplash.com/photo-1560368817-f50fba7be08e?auto=format&fit=crop&w=800&q=80", isMain: true }], // general magnetic toys
    stock: 130,
    tags: ["magnetic", "building", "educational", "toddler"],
    categoryName: "Educational Toys"
  }
];

async function addToysProducts() {
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

    console.log("Adding Toys & Games Products...");
    
    let addedCount = 0;
    
    for (const prodData of TOYS_PRODUCTS) {
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

addToysProducts();

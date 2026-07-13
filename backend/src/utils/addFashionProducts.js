import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const FASHION_PRODUCTS = [
  {
    name: "Levi's 511 Slim Fit Jeans",
    description: "Classic slim-fit jeans featuring a five-pocket design, zip fly, and premium stretch denim for all-day comfort.",
    shortDescription: "Classic slim fit premium stretch jeans.",
    price: 3499,
    originalPrice: 4299,
    brand: "Levi's",
    sku: "LVI-511-SLIM-BLU",
    images: [{ url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 50,
    isFeatured: true,
    tags: ["jeans", "men", "denim", "levi's"],
    specifications: [
      { key: "Material", value: "99% Cotton, 1% Elastane" },
      { key: "Fit", value: "Slim Fit" }
    ],
    categoryName: "Men's Clothing"
  },
  {
    name: "Zara Basic White T-Shirt",
    description: "Essential crew neck short sleeve t-shirt made with 100% organic cotton for a relaxed, everyday fit.",
    shortDescription: "100% organic cotton basic white tee.",
    price: 999,
    originalPrice: 1299,
    brand: "Zara",
    sku: "ZRA-BSC-TEE-WHT",
    images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 120,
    tags: ["t-shirt", "men", "basic", "cotton"],
    categoryName: "Men's Clothing"
  },
  {
    name: "H&M Floral Maxi Dress",
    description: "Elegant ankle-length dress in airy chiffon with a vibrant floral print, V-neck, and a tie belt at the waist.",
    shortDescription: "Floral chiffon maxi dress with tie belt.",
    price: 2999,
    originalPrice: 3999,
    brand: "H&M",
    sku: "HM-FLR-MAXI-DRS",
    images: [{ url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 40,
    isFeatured: true,
    tags: ["dress", "women", "floral", "maxi"],
    categoryName: "Women's Clothing"
  },
  {
    name: "Mango Faux Leather Biker Jacket",
    description: "Classic faux leather biker jacket featuring lapel collar, asymmetrical zip closure, and zip pockets.",
    shortDescription: "Classic faux leather black biker jacket.",
    price: 4999,
    originalPrice: 6599,
    brand: "Mango",
    sku: "MNG-FLZ-BKR-BLK",
    images: [{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 25,
    tags: ["jacket", "women", "leather", "biker"],
    categoryName: "Women's Clothing"
  },
  {
    name: "Carter's Cotton Pajama Set",
    description: "Comfortable and cozy two-piece cotton sleepwear set for kids, featuring fun graphic prints.",
    shortDescription: "2-piece cotton graphic pajama set.",
    price: 1299,
    originalPrice: 1899,
    brand: "Carter's",
    sku: "CRT-PJ-SET-KID",
    images: [{ url: "https://images.unsplash.com/photo-1519276502123-cb459bdf14d0?auto=format&fit=crop&w=800&q=80", isMain: true }], // general kids clothing image
    stock: 60,
    tags: ["pajamas", "kids", "sleepwear", "cotton"],
    categoryName: "Kids Clothing"
  },
  {
    name: "Nike Air Force 1 '07",
    description: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best.",
    shortDescription: "Classic white leather sneakers.",
    price: 7495,
    originalPrice: 7495,
    brand: "Nike",
    sku: "NKE-AF1-07-WHT",
    images: [{ url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 80,
    isFeatured: true,
    tags: ["sneakers", "shoes", "footwear", "nike"],
    categoryName: "Footwear"
  },
  {
    name: "Adidas Ultraboost 1.0",
    description: "High-performance running shoes with responsive BOOST cushioning and a foot-hugging PRIMEKNIT upper.",
    shortDescription: "Responsive cushioned running shoes.",
    price: 15999,
    originalPrice: 17999,
    brand: "Adidas",
    sku: "ADD-UB1-BLK",
    images: [{ url: "https://images.unsplash.com/photo-1587563871167-1ea9f193796d?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 35,
    tags: ["running", "shoes", "footwear", "adidas"],
    categoryName: "Footwear"
  },
  {
    name: "Casio G-Shock Matte Black",
    description: "Durable and shock-resistant digital watch featuring 200m water resistance, stopwatch, and EL backlight.",
    shortDescription: "Rugged matte black digital watch.",
    price: 6495,
    originalPrice: 6995,
    brand: "Casio",
    sku: "CSO-GSHK-MB",
    images: [{ url: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 45,
    isFeatured: false,
    tags: ["watch", "accessories", "g-shock", "casio"],
    categoryName: "Watches"
  },
  {
    name: "Fossil Gen 6 Smartwatch",
    description: "Stylish smartwatch powered by Wear OS, featuring heart rate tracking, SpO2 sensor, and customizable dials.",
    shortDescription: "Stainless steel Wear OS smartwatch.",
    price: 22995,
    originalPrice: 24995,
    brand: "Fossil",
    sku: "FSL-GEN6-SS",
    images: [{ url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 20,
    tags: ["smartwatch", "watch", "fossil", "wearable"],
    categoryName: "Watches"
  },
  {
    name: "Tommy Hilfiger Leather Wallet",
    description: "Premium genuine leather bi-fold wallet featuring multiple card slots, bill compartments, and iconic flag logo.",
    shortDescription: "Genuine leather bi-fold wallet.",
    price: 1999,
    originalPrice: 2999,
    brand: "Tommy Hilfiger",
    sku: "TH-LTH-WLT-BRN",
    images: [{ url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 55,
    tags: ["wallet", "accessories", "leather", "tommy hilfiger"],
    categoryName: "Bags & Wallets"
  }
];

async function addFashionProducts() {
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

    console.log("Adding Fashion Products...");
    
    let addedCount = 0;
    
    for (const prodData of FASHION_PRODUCTS) {
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

addFashionProducts();

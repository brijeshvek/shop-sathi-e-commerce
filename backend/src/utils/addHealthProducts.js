import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const HEALTH_PRODUCTS = [
  {
    name: "Optimum Nutrition Gold Standard 100% Whey Protein",
    description: "24g of blended protein consisting of whey protein isolate, whey protein concentrate, and whey peptides to support lean muscle mass.",
    shortDescription: "24g Whey Protein Blend, Double Rich Chocolate.",
    price: 3500,
    originalPrice: 4200,
    brand: "Optimum Nutrition",
    sku: "ON-WHEY-2LB-CHOC",
    images: [{ url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 120,
    isFeatured: true,
    tags: ["protein", "fitness", "nutrition", "whey"],
    categoryName: "Fitness Nutrition"
  },
  {
    name: "Centrum Adult Multivitamin",
    description: "Daily multivitamin supplement packed with essential nutrients to support energy, immunity, and metabolism.",
    shortDescription: "Complete daily multivitamin for adults (130 count).",
    price: 999,
    originalPrice: 1299,
    brand: "Centrum",
    sku: "CEN-MULTI-ADULT-130",
    images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5e1816e83?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 200,
    tags: ["vitamins", "health", "supplements", "immunity"],
    categoryName: "Vitamins & Supplements"
  },
  {
    name: "Nature Made Fish Oil 1000 mg",
    description: "Fish oil supplement containing Omega-3 fatty acids EPA and DHA to help support a healthy heart.",
    shortDescription: "1000mg Fish Oil with Omega-3 (250 Softgels).",
    price: 1499,
    originalPrice: 1899,
    brand: "Nature Made",
    sku: "NM-FISH-OIL-1000",
    images: [{ url: "https://images.unsplash.com/photo-1550572017-edb79901844b?auto=format&fit=crop&w=800&q=80", isMain: true }], // general pills visual
    stock: 150,
    tags: ["fish oil", "omega-3", "supplements", "heart health"],
    categoryName: "Vitamins & Supplements"
  },
  {
    name: "Omron Silver Blood Pressure Monitor",
    description: "Advanced accuracy upper arm blood pressure monitor with Bluetooth connectivity and a wide-range D-ring cuff.",
    shortDescription: "Smart upper arm blood pressure monitor.",
    price: 3499,
    originalPrice: 4299,
    brand: "Omron",
    sku: "OMR-BP-SILVER",
    images: [{ url: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 45,
    isFeatured: true,
    tags: ["medical", "blood pressure", "monitor", "health"],
    categoryName: "Medical Equipment"
  },
  {
    name: "Braun ThermoScan 7 Ear Thermometer",
    description: "Accurate ear thermometer featuring Age Precision technology for age-adjustable fever guidance.",
    shortDescription: "Ear thermometer with Age Precision.",
    price: 4999,
    originalPrice: 5999,
    brand: "Braun",
    sku: "BRN-THERMO-7",
    images: [{ url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80", isMain: true }], // general medical visual
    stock: 60,
    tags: ["thermometer", "medical", "fever", "health"],
    categoryName: "Medical Equipment"
  },
  {
    name: "MuscleTech Platinum 100% Creatine",
    description: "Ultra-pure micronized creatine powder to help build lean muscle, increase strength, and enhance performance.",
    shortDescription: "400g Micronized Creatine Powder.",
    price: 1299,
    originalPrice: 1699,
    brand: "MuscleTech",
    sku: "MT-CREATINE-400G",
    images: [{ url: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=800&q=80", isMain: true }], // general fitness nutrition visual
    stock: 85,
    tags: ["creatine", "fitness", "nutrition", "strength"],
    categoryName: "Fitness Nutrition"
  },
  {
    name: "Yogi Tea - Honey Lavender Stress Relief",
    description: "A soothing herbal tea blend of lavender, chamomile, and lemon balm designed to help relax the mind and body.",
    shortDescription: "Relaxing herbal tea blend (16 tea bags).",
    price: 399,
    originalPrice: 499,
    brand: "Yogi Tea",
    sku: "YOGI-TEA-STRESS",
    images: [{ url: "https://images.unsplash.com/photo-1576092762791-dd9e2220abd4?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 250,
    tags: ["tea", "wellness", "stress relief", "herbal"],
    categoryName: "Wellness Products"
  },
  {
    name: "Vital Proteins Collagen Peptides",
    description: "Unflavored collagen powder sourced from grass-fed, pasture-raised bovine to support healthy hair, skin, nails, and joints.",
    shortDescription: "Unflavored collagen peptide powder.",
    price: 2499,
    originalPrice: 2999,
    brand: "Vital Proteins",
    sku: "VP-COLLAGEN-10OZ",
    images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5e1816e83?auto=format&fit=crop&w=800&q=80", isMain: true }], // general supplements visual
    stock: 75,
    isFeatured: true,
    tags: ["collagen", "supplements", "wellness", "skin"],
    categoryName: "Vitamins & Supplements"
  },
  {
    name: "Accu-Chek Guide Me Blood Glucose Meter",
    description: "Simple and accurate blood glucose monitoring system, featuring a large, easy-to-read display and Bluetooth connectivity.",
    shortDescription: "Smart blood glucose meter system.",
    price: 1599,
    originalPrice: 1999,
    brand: "Accu-Chek",
    sku: "ACCU-GLUCO-GM",
    images: [{ url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80", isMain: true }], // general medical test visual
    stock: 50,
    tags: ["medical", "diabetes", "monitor", "health"],
    categoryName: "Medical Equipment"
  },
  {
    name: "Theragun Prime Massage Gun",
    description: "Quiet and powerful percussive therapy device designed to ease discomfort, soothe tightness, and recover faster.",
    shortDescription: "Smart percussive therapy massage gun.",
    price: 24900,
    originalPrice: 28900,
    brand: "Therabody",
    sku: "THERA-PRIME-BLK",
    images: [{ url: "https://images.unsplash.com/photo-1588665985850-93a8d9b1db1d?auto=format&fit=crop&w=800&q=80", isMain: true }], // general wellness device visual
    stock: 20,
    tags: ["massage", "wellness", "recovery", "theragun"],
    categoryName: "Wellness Products"
  }
];

async function addHealthProducts() {
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

    console.log("Adding Health & Wellness Products...");
    
    let addedCount = 0;
    
    for (const prodData of HEALTH_PRODUCTS) {
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

addHealthProducts();

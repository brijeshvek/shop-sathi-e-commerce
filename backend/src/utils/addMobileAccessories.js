import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const MOBILE_ACCESSORIES_PRODUCTS = [
  {
    name: "OtterBox Defender Series Case for Galaxy S24 Ultra",
    description: "Rugged multi-layer defense case with a solid inner shell, resilient outer slipcover, and a holster that doubles as a kickstand.",
    shortDescription: "Multi-layer drop protection case.",
    price: 4999,
    originalPrice: 5999,
    brand: "OtterBox",
    sku: "OTB-DEF-S24U-BLK",
    images: [{ url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 45,
    isFeatured: false,
    tags: ["case", "samsung", "s24 ultra", "otterbox", "rugged"],
    specifications: [
      { key: "Material", value: "Polycarbonate, Synthetic Rubber" },
      { key: "Color", value: "Black" }
    ],
    categoryName: "Phone Cases"
  },
  {
    name: "Spigen Glas.tR EZ Fit Tempered Glass for iPhone 15 Pro",
    description: "Premium tempered glass screen protector with an innovative, auto-alignment installation tray.",
    shortDescription: "9H Hardness tempered glass with EZ Fit tray.",
    price: 1499,
    originalPrice: 1999,
    brand: "Spigen",
    sku: "SPG-GLAS-IP15P",
    images: [{ url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 100,
    isFeatured: false,
    tags: ["screen protector", "iphone 15 pro", "spigen", "tempered glass"],
    categoryName: "Screen Protectors"
  },
  {
    name: "Apple 20W USB-C Power Adapter",
    description: "The Apple 20W USB‑C Power Adapter offers fast, efficient charging at home, in the office, or on the go.",
    shortDescription: "Original Apple 20W USB-C fast charger.",
    price: 1699,
    originalPrice: 1900,
    brand: "Apple",
    sku: "APL-20W-USBC",
    images: [{ url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 150,
    isFeatured: true,
    tags: ["charger", "apple", "adapter", "usb-c"],
    specifications: [
      { key: "Wattage", value: "20W" },
      { key: "Port", value: "USB-C" }
    ],
    categoryName: "Chargers"
  },
  {
    name: "Anker 313 Wireless Charger (Pad)",
    description: "Qi-certified wireless charging pad capable of fast charging supported devices up to 10W.",
    shortDescription: "10W Fast-Charging Wireless Pad.",
    price: 1299,
    originalPrice: 1599,
    brand: "Anker",
    sku: "ANK-313-WCP",
    images: [{ url: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 60,
    tags: ["charger", "wireless", "anker", "qi"],
    categoryName: "Chargers"
  },
  {
    name: "Samsung 10000mAh Super Fast Charge Power Bank",
    description: "Portable 10,000mAh battery pack featuring 25W Super Fast Charging and dual USB-C ports.",
    shortDescription: "10000mAh, 25W Super Fast Charge, Dual USB-C.",
    price: 2499,
    originalPrice: 3499,
    brand: "Samsung",
    sku: "SAM-PB-10K-25W",
    images: [{ url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 80,
    tags: ["powerbank", "samsung", "portable", "25w"],
    categoryName: "Power Banks"
  },
  {
    name: "Belkin BoostCharge Pro Flex USB-C to Lightning Cable",
    description: "Ultra-flexible, highly durable braided silicone cable designed to resist tangling and fraying. MFi Certified.",
    shortDescription: "Braided Silicone USB-C to Lightning Cable (1M).",
    price: 1499,
    originalPrice: 1999,
    brand: "Belkin",
    sku: "BLK-BCPF-USBC-LT",
    images: [{ url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 120,
    tags: ["cable", "lightning", "belkin", "mfi"],
    categoryName: "Cables"
  },
  {
    name: "Sony WF-1000XM5 True Wireless Earbuds",
    description: "Industry-leading noise cancellation earbuds with High-Resolution Audio and up to 24 hours of battery life.",
    shortDescription: "Premium Noise Cancelling True Wireless Earbuds.",
    price: 24990,
    originalPrice: 29990,
    brand: "Sony",
    sku: "SONY-WF1000XM5",
    images: [{ url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 35,
    isFeatured: true,
    tags: ["earbuds", "audio", "sony", "noise cancelling"],
    categoryName: "Earbuds & Headphones"
  },
  {
    name: "Apple AirPods Pro (2nd Generation)",
    description: "AirPods Pro feature up to 2x more Active Noise Cancellation, plus Adaptive Transparency, and Personalized Spatial Audio.",
    shortDescription: "Active Noise Cancellation, Spatial Audio.",
    price: 24900,
    originalPrice: 26900,
    brand: "Apple",
    sku: "APL-AIRPODSPRO-2",
    images: [{ url: "https://images.unsplash.com/photo-1606220588913-b3eea8951234?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 50,
    isFeatured: true,
    tags: ["earbuds", "apple", "airpods", "audio"],
    categoryName: "Earbuds & Headphones"
  },
  {
    name: "Apple Watch Series 9 (GPS, 45mm)",
    description: "Smarter, brighter, and mightier Apple Watch featuring the S9 chip, double tap gesture, and carbon neutral combinations.",
    shortDescription: "Midnight Aluminum Case with Midnight Sport Band.",
    price: 44900,
    originalPrice: 44900,
    brand: "Apple",
    sku: "APL-AW9-GPS-45M",
    images: [{ url: "https://images.unsplash.com/photo-1434493789847-2f02b0c156f4?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 25,
    isFeatured: true,
    tags: ["smartwatch", "apple watch", "wearable", "fitness"],
    categoryName: "Smartwatches"
  },
  {
    name: "iOttie Easy One Touch 5 Car Mount",
    description: "Dashboard and windshield mount designed to securely hold smartphones of all sizes with a patented one-touch mechanism.",
    shortDescription: "Universal Dashboard & Windshield Car Mount.",
    price: 2299,
    originalPrice: 2999,
    brand: "iOttie",
    sku: "IOT-EOT5-CM",
    images: [{ url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 75,
    tags: ["holder", "mount", "car accessory", "iottie"],
    categoryName: "Phone Holders"
  }
];

async function addMobileAccessoriesProducts() {
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

    console.log("Adding Mobile Accessories Products...");
    
    let addedCount = 0;
    
    for (const prodData of MOBILE_ACCESSORIES_PRODUCTS) {
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

addMobileAccessoriesProducts();

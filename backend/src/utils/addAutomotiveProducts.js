import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const AUTOMOTIVE_PRODUCTS = [
  {
    name: "Bosch ICON Wiper Blades (2-Pack)",
    description: "Exclusive tension spring arcing technology creates a fit that’s custom-contoured to the curvature of each side of the windshield. Up to 40% longer life than other premium blades.",
    shortDescription: "Premium beam style wiper blades.",
    price: 3499,
    originalPrice: 4299,
    brand: "Bosch",
    sku: "AUTO-BSCH-ICON",
    images: [{ url: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80", isMain: true }], // General automotive visual
    stock: 80,
    isFeatured: true,
    tags: ["wiper blades", "car", "accessories", "bosch"],
    categoryName: "Car Accessories"
  },
  {
    name: "WeatherTech Custom Fit FloorLiners (Front Row)",
    description: "Laser measured for a perfect fit, these high-density floor liners provide absolute interior protection against fluids and debris.",
    shortDescription: "Custom fit laser measured floor liners.",
    price: 12900,
    originalPrice: 13900,
    brand: "WeatherTech",
    sku: "AUTO-WT-FL-FRNT",
    images: [{ url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80", isMain: true }], // General car interior visual
    stock: 25,
    tags: ["floor mats", "weathertech", "car interior", "accessories"],
    categoryName: "Car Accessories"
  },
  {
    name: "NOCO Boost Plus GB40 1000A UltraSafe Car Battery Jump Starter",
    description: "Compact yet powerful lithium jump starter rated at 1000 amps. Can jump start a dead battery in seconds on a single charge.",
    shortDescription: "1000 Amp ultra-safe lithium jump starter.",
    price: 9900,
    originalPrice: 12500,
    brand: "NOCO",
    sku: "AUTO-NOCO-GB40",
    images: [{ url: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=800&q=80", isMain: true }], // General engine/battery visual
    stock: 50,
    isFeatured: true,
    tags: ["jump starter", "battery", "noco", "car"],
    categoryName: "Car Accessories"
  },
  {
    name: "Roam Universal Premium Bike Phone Mount",
    description: "Secure and adjustable phone mount for bicycles and motorcycles. Fits all smartphones with screen sizes from 4 to 6.8 inches.",
    shortDescription: "Universal secure bike phone mount.",
    price: 1599,
    originalPrice: 1999,
    brand: "Roam",
    sku: "AUTO-BK-ROAM-MNT",
    images: [{ url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80", isMain: true }], // General bike visual
    stock: 120,
    tags: ["bike", "phone mount", "accessories", "cycling"],
    categoryName: "Bike Accessories"
  },
  {
    name: "Kryptonite New York Lock Standard U-Lock",
    description: "Maximum security U-lock featuring a 16mm hardened MAX-Performance steel shackle that resists bolt cutters and leverage attacks.",
    shortDescription: "Maximum security 16mm steel U-lock.",
    price: 8999,
    originalPrice: 9999,
    brand: "Kryptonite",
    sku: "AUTO-BK-KRYP-NY",
    images: [{ url: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80", isMain: true }], // General bike visual
    stock: 45,
    tags: ["bike lock", "u-lock", "security", "kryptonite"],
    categoryName: "Bike Accessories"
  },
  {
    name: "Bell Qualifier Full-Face Motorcycle Helmet",
    description: "Lightweight polycarbonate/ABS shell construction. Padded wind collar drastically reduces wind and road noise.",
    shortDescription: "Lightweight aerodynamic full-face helmet.",
    price: 11900,
    originalPrice: 12900,
    brand: "Bell",
    sku: "AUTO-HLM-BELL-Q",
    images: [{ url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 35,
    isFeatured: true,
    tags: ["helmet", "motorcycle", "safety", "bell"],
    categoryName: "Helmets & Safety"
  },
  {
    name: "Giro Fixture MIPS Adult Dirt Cycling Helmet",
    description: "Features Integrated MIPS (Multi-Directional Impact Protection System) to redirect impact energy and provide more protection in certain impacts.",
    shortDescription: "Mountain bike helmet with MIPS safety.",
    price: 5499,
    originalPrice: 6599,
    brand: "Giro",
    sku: "AUTO-HLM-GIRO-FIX",
    images: [{ url: "https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 60,
    tags: ["helmet", "cycling", "bike", "safety"],
    categoryName: "Helmets & Safety"
  },
  {
    name: "Meguiar's Ultimate Liquid Wax",
    description: "Pure synthetic wax that provides maximum synthetic protection, durability, depth of color, and reflectivity in one easy step.",
    shortDescription: "Premium synthetic liquid car wax.",
    price: 2499,
    originalPrice: 2999,
    brand: "Meguiar's",
    sku: "AUTO-CC-MEG-WAX",
    images: [{ url: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80", isMain: true }], // General car detailing visual
    stock: 90,
    tags: ["car wax", "detailing", "meguiars", "car care"],
    categoryName: "Car Care & Engine Oils"
  },
  {
    name: "Chemical Guys Mr. Pink Super Suds Car Wash Soap",
    description: "Tough on dirt, gentle on sealant and wax. Creates thick, dirt-fighting bubbles that clean any vehicle thoroughly.",
    shortDescription: "Super suds car wash shampoo.",
    price: 1299,
    originalPrice: 1599,
    brand: "Chemical Guys",
    sku: "AUTO-CC-CG-PNK",
    images: [{ url: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80", isMain: true }], // General car wash visual
    stock: 150,
    tags: ["car wash", "soap", "cleaning", "detailing"],
    categoryName: "Car Care & Engine Oils"
  },
  {
    name: "Mobil 1 Extended Performance Full Synthetic Motor Oil 5W-30",
    description: "Advanced full synthetic motor oil designed to deliver outstanding engine protection and protect critical engine parts for up to 20,000 miles between oil changes.",
    shortDescription: "5W-30 Full synthetic motor oil (5 Quart).",
    price: 3599,
    originalPrice: 4299,
    brand: "Mobil 1",
    sku: "AUTO-OIL-MBL1-5W30",
    images: [{ url: "https://images.unsplash.com/photo-1580274455171-bf8532454157?auto=format&fit=crop&w=800&q=80", isMain: true }], // General oil/engine visual
    stock: 100,
    isFeatured: true,
    tags: ["motor oil", "synthetic", "mobil 1", "car care"],
    categoryName: "Car Care & Engine Oils"
  }
];

async function addAutomotiveProducts() {
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

    console.log("Adding Automotive Products...");
    
    let addedCount = 0;
    
    for (const prodData of AUTOMOTIVE_PRODUCTS) {
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

addAutomotiveProducts();

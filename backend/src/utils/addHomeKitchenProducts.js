import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const HOME_KITCHEN_PRODUCTS = [
  {
    name: "Ashley Furniture Alenya Sofa",
    description: "Classic track arm sofa wrapped in a soft charcoal microfiber upholstery. Features reversible cushions and a sturdy frame.",
    shortDescription: "Charcoal gray classic microfiber sofa.",
    price: 35000,
    originalPrice: 42000,
    brand: "Ashley Furniture",
    sku: "ASH-ALN-SOF-CHA",
    images: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 12,
    isFeatured: true,
    tags: ["sofa", "furniture", "living room", "ashley"],
    categoryName: "Furniture"
  },
  {
    name: "Ninja Air Fryer Max XL",
    description: "5.5 Quart air fryer that cooks, crisps, roasts, bakes, and reheats with little to no oil. Features Max Crisp Technology.",
    shortDescription: "5.5 Qt fast heating Air Fryer.",
    price: 11999,
    originalPrice: 14999,
    brand: "Ninja",
    sku: "NNJ-AF161-XL",
    images: [{ url: "https://images.unsplash.com/photo-1626201633513-e4c1328905c9?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 45,
    tags: ["air fryer", "kitchen", "appliance", "ninja"],
    categoryName: "Kitchen Appliances"
  },
  {
    name: "KitchenAid Artisan Series 5-Quart Stand Mixer",
    description: "Iconic stand mixer with a 5-quart stainless steel bowl, 10 speeds, and tilt-head design for easy access.",
    shortDescription: "Iconic 5-Qt tilt-head stand mixer.",
    price: 39999,
    originalPrice: 44999,
    brand: "KitchenAid",
    sku: "KTA-ART-5QT-RED",
    images: [{ url: "https://images.unsplash.com/photo-1593006450949-a2e6f4770176?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 20,
    isFeatured: true,
    tags: ["mixer", "baking", "kitchenaid", "appliance"],
    categoryName: "Kitchen Appliances"
  },
  {
    name: "Le Creuset Enameled Cast Iron Signature Round Dutch Oven",
    description: "5.5 Quart classic enameled cast iron Dutch oven, perfect for slow-cooking, roasting, baking, and frying.",
    shortDescription: "5.5 Qt enameled cast iron Dutch oven.",
    price: 28999,
    originalPrice: 32000,
    brand: "Le Creuset",
    sku: "LEC-DO-55QT-RED",
    images: [{ url: "https://images.unsplash.com/photo-1584346931505-188cc517f8a7?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 15,
    tags: ["dutch oven", "cookware", "cast iron", "le creuset"],
    categoryName: "Cookware"
  },
  {
    name: "Caraway Nonstick Ceramic Cookware Set",
    description: "7-piece premium non-toxic, non-stick ceramic coated cookware set including pans, pots, and lids with storage.",
    shortDescription: "Non-toxic ceramic coated cookware set.",
    price: 34500,
    originalPrice: 38500,
    brand: "Caraway",
    sku: "CRW-7PC-CSET",
    images: [{ url: "https://images.unsplash.com/photo-1584988713293-9c86466f2873?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 30,
    tags: ["cookware", "pans", "ceramic", "nonstick"],
    categoryName: "Cookware"
  },
  {
    name: "West Elm Pure White Ceramic Vase",
    description: "Handcrafted pure white ceramic vase with an elegant modern silhouette, perfect for fresh blooms or dried branches.",
    shortDescription: "Modern pure white ceramic vase.",
    price: 2499,
    originalPrice: 3200,
    brand: "West Elm",
    sku: "WE-CV-WHT",
    images: [{ url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 60,
    tags: ["vase", "decor", "home", "ceramic"],
    categoryName: "Home Decor"
  },
  {
    name: "Philips Hue White and Color Ambiance Smart Bulbs",
    description: "Starter kit with 4 smart LED bulbs and a Hue Hub. Control your lights with voice or app, choosing from 16 million colors.",
    shortDescription: "Smart LED color bulbs starter kit.",
    price: 14999,
    originalPrice: 16999,
    brand: "Philips Hue",
    sku: "PHU-WCA-4PK",
    images: [{ url: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 40,
    isFeatured: true,
    tags: ["lighting", "smart home", "philips hue", "bulbs"],
    categoryName: "Lighting"
  },
  {
    name: "Vitamix 5200 Professional-Grade Blender",
    description: "High-performance blender with a 64 oz container, perfect for blending medium to large batches of smoothies, soups, and more.",
    shortDescription: "Professional-grade 64 oz blender.",
    price: 38999,
    originalPrice: 42999,
    brand: "Vitamix",
    sku: "VTX-5200-PRO",
    images: [{ url: "https://images.unsplash.com/photo-1585237832860-8438f465c023?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 22,
    tags: ["blender", "kitchen", "appliance", "vitamix"],
    categoryName: "Kitchen Appliances"
  },
  {
    name: "Brooklinen Luxe Core Sheet Set",
    description: "100% long-staple cotton, 480-thread count sateen weave sheet set featuring a flat sheet, fitted sheet, and 2 pillowcases.",
    shortDescription: "480-thread count cotton sateen sheets.",
    price: 12900,
    originalPrice: 14500,
    brand: "Brooklinen",
    sku: "BKL-LUX-SHT-Q",
    images: [{ url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 55,
    tags: ["bedding", "sheets", "bedroom", "cotton"],
    categoryName: "Bedding"
  },
  {
    name: "Tempur-Pedic TEMPUR-Cloud Memory Foam Pillow",
    description: "Premium memory foam pillow offering extra-soft support that adapts to your head, neck, and shoulders.",
    shortDescription: "Soft adaptive memory foam pillow.",
    price: 6500,
    originalPrice: 7999,
    brand: "Tempur-Pedic",
    sku: "TMP-CLD-PLW",
    images: [{ url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 75,
    tags: ["pillow", "bedding", "memory foam", "sleep"],
    categoryName: "Bedding"
  }
];

async function addHomeKitchenProducts() {
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

    console.log("Adding Home & Kitchen Products...");
    
    let addedCount = 0;
    
    for (const prodData of HOME_KITCHEN_PRODUCTS) {
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

addHomeKitchenProducts();

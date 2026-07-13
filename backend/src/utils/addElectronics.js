import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const ELECTRONICS_PRODUCTS = [
  {
    name: "Samsung Galaxy S24 Ultra 5G",
    description: "AI-powered flagship smartphone featuring Snapdragon 8 Gen 3, titanium frame, and 200MP camera system.",
    shortDescription: "Snapdragon 8 Gen 3, 200MP Camera, Titanium Frame.",
    price: 129999,
    originalPrice: 134999,
    brand: "Samsung",
    sku: "SAM-S24U-256G",
    images: [{ url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 15,
    isFeatured: true,
    tags: ["smartphone", "samsung", "galaxy", "5g"],
    specifications: [
      { key: "Processor", value: "Snapdragon 8 Gen 3" },
      { key: "RAM", value: "12 GB" },
      { key: "Storage", value: "256 GB" }
    ],
    categoryName: "Smartphones"
  },
  {
    name: "Asus ROG Strix G16 (2024)",
    description: "High-performance gaming laptop with Intel Core i9-14900HX, NVIDIA RTX 4070, and a 165Hz Nebula display.",
    shortDescription: "Intel i9 14th Gen, RTX 4070, 16GB RAM, 1TB SSD.",
    price: 154990,
    originalPrice: 179990,
    brand: "Asus",
    sku: "ASUS-ROG-G16-4070",
    images: [{ url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 10,
    isFeatured: true,
    tags: ["laptop", "gaming", "asus", "rog"],
    specifications: [
      { key: "Processor", value: "Intel Core i9-14900HX" },
      { key: "Graphics", value: "NVIDIA RTX 4070" },
      { key: "RAM", value: "16 GB DDR5" }
    ],
    categoryName: "Laptops"
  },
  {
    name: "Apple Mac mini M2 Pro",
    description: "Supercharged by M2 Pro, Mac mini tackles compute‑intensive tasks like massive images and 8K ProRes video.",
    shortDescription: "Apple M2 Pro chip, 16GB RAM, 512GB SSD.",
    price: 129900,
    originalPrice: 129900,
    brand: "Apple",
    sku: "APL-MACMINI-M2P",
    images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 25,
    isFeatured: false,
    tags: ["desktop", "apple", "mac mini", "m2 pro"],
    specifications: [
      { key: "Processor", value: "Apple M2 Pro" },
      { key: "Memory", value: "16 GB Unified" },
      { key: "Storage", value: "512 GB SSD" }
    ],
    categoryName: "Desktop Computers"
  },
  {
    name: "AMD Ryzen 9 7950X Desktop Processor",
    description: "16-core, 32-thread unlocked desktop processor with Zen 4 architecture for elite gaming and content creation.",
    shortDescription: "16 Cores, 32 Threads, Up to 5.7 GHz Boost.",
    price: 54999,
    originalPrice: 65999,
    brand: "AMD",
    sku: "AMD-R9-7950X",
    images: [{ url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 30,
    tags: ["processor", "cpu", "amd", "ryzen 9"],
    categoryName: "Computer Components"
  },
  {
    name: "LG 27-inch 4K UHD IPS Monitor",
    description: "27-inch 4K UHD (3840 x 2160) IPS Display with VESA DisplayHDR 400 and USB Type-C connectivity.",
    shortDescription: "4K UHD IPS, HDR 400, USB-C 90W PD.",
    price: 34999,
    originalPrice: 45000,
    brand: "LG",
    sku: "LG-27UP850N-W",
    images: [{ url: "https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 15,
    isFeatured: true,
    tags: ["monitor", "lg", "4k", "display"],
    categoryName: "Monitors"
  },
  {
    name: "HP LaserJet Pro MFP 4101fdw",
    description: "Wireless monochrome laser printer designed for maximum productivity with fast speeds and reliable hardware.",
    shortDescription: "Wireless Monochrome Laser Printer, Print/Scan/Copy/Fax.",
    price: 38999,
    originalPrice: 42999,
    brand: "HP",
    sku: "HP-LJ-4101FDW",
    images: [{ url: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 12,
    tags: ["printer", "hp", "laserjet", "office"],
    categoryName: "Printers & Scanners"
  },
  {
    name: "TP-Link Archer AX73 Wi-Fi 6 Router",
    description: "AX5400 Dual-Band Gigabit Wi-Fi 6 Router for smooth 8K streaming, VR gaming, and large home coverage.",
    shortDescription: "AX5400 Wi-Fi 6, Dual-Band, 6 Antennas.",
    price: 9999,
    originalPrice: 12999,
    brand: "TP-Link",
    sku: "TPL-ARCHER-AX73",
    images: [{ url: "https://images.unsplash.com/photo-1544122860-15632120db37?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 40,
    tags: ["router", "networking", "wifi 6", "tp-link"],
    categoryName: "Networking"
  },
  {
    name: "Samsung 990 PRO 2TB NVMe M.2 SSD",
    description: "PCIe 4.0 NVMe SSD delivering blistering speeds up to 7,450 MB/s for elite gaming and professional workflows.",
    shortDescription: "2TB PCIe 4.0 NVMe, Up to 7450 MB/s Read.",
    price: 16999,
    originalPrice: 22999,
    brand: "Samsung",
    sku: "SAM-990PRO-2TB",
    images: [{ url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 50,
    tags: ["ssd", "storage", "nvme", "samsung"],
    categoryName: "Storage Devices"
  },
  {
    name: "Amazon Echo Dot (5th Gen, 2022)",
    description: "Smart speaker with Alexa, featuring deeper bass, clearer vocals, and a temperature sensor.",
    shortDescription: "Smart speaker with Alexa, Deep Bass.",
    price: 5499,
    originalPrice: 5499,
    brand: "Amazon",
    sku: "AMZ-ECHO-DOT5",
    images: [{ url: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 60,
    tags: ["smart speaker", "alexa", "amazon", "smart home"],
    categoryName: "Smart Home"
  },
  {
    name: "Microsoft Surface Pro 9",
    description: "13-inch 2-in-1 tablet PC featuring Intel Core i7, 16GB RAM, and 512GB SSD with Windows 11.",
    shortDescription: "Intel i7, 16GB RAM, 512GB SSD, 13-inch Touchscreen.",
    price: 139999,
    originalPrice: 154999,
    brand: "Microsoft",
    sku: "MS-SURFPRO9-I7",
    images: [{ url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 18,
    isFeatured: true,
    tags: ["tablet", "windows", "surface", "microsoft"],
    specifications: [
      { key: "Processor", value: "Intel Core i7 12th Gen" },
      { key: "RAM", value: "16 GB" },
      { key: "Storage", value: "512 GB SSD" }
    ],
    categoryName: "Tablets"
  }
];

async function addElectronicsProducts() {
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

    console.log("Adding Electronics Products...");
    
    let addedCount = 0;
    
    for (const prodData of ELECTRONICS_PRODUCTS) {
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

addElectronicsProducts();

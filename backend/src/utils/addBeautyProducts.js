import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const BEAUTY_PRODUCTS = [
  {
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    description: "High-strength vitamin and mineral blemish formula that reduces the appearance of skin blemishes and congestion.",
    shortDescription: "Blemish formula with Niacinamide & Zinc.",
    price: 650,
    originalPrice: 800,
    brand: "The Ordinary",
    sku: "ORD-NIA-30ML",
    images: [{ url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 150,
    isFeatured: true,
    tags: ["skincare", "serum", "niacinamide", "the ordinary"],
    specifications: [
      { key: "Volume", value: "30 ml" },
      { key: "Skin Type", value: "All Skin Types" }
    ],
    categoryName: "Skincare"
  },
  {
    name: "CeraVe Hydrating Facial Cleanser",
    description: "Gentle face wash with hyaluronic acid, ceramides, and glycerin to help hydrate skin without stripping moisture.",
    shortDescription: "Hydrating facial cleanser for normal to dry skin.",
    price: 1250,
    originalPrice: 1450,
    brand: "CeraVe",
    sku: "CRV-HFC-355ML",
    images: [{ url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 120,
    tags: ["cleanser", "skincare", "cerave", "hydrating"],
    categoryName: "Skincare"
  },
  {
    name: "Olaplex No. 7 Bonding Oil",
    description: "Highly-concentrated, weightless reparative styling oil that dramatically increases shine, softness, and color vibrancy.",
    shortDescription: "Reparative styling hair oil.",
    price: 2950,
    originalPrice: 3200,
    brand: "Olaplex",
    sku: "OLP-NO7-30ML",
    images: [{ url: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 80,
    isFeatured: true,
    tags: ["hair care", "oil", "olaplex", "styling"],
    categoryName: "Hair Care"
  },
  {
    name: "Dyson Supersonic Hair Dryer",
    description: "Fast drying. No extreme heat. Engineered for different hair types, featuring magnetic styling attachments.",
    shortDescription: "Advanced hair dryer with magnetic attachments.",
    price: 34900,
    originalPrice: 34900,
    brand: "Dyson",
    sku: "DYS-SUP-HD08",
    images: [{ url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 25,
    isFeatured: true,
    tags: ["hair dryer", "beauty tools", "dyson", "styling"],
    categoryName: "Beauty Tools"
  },
  {
    name: "MAC Studio Fix Fluid Foundation",
    description: "A modern foundation that combines a matte finish and medium-to-full buildable coverage with broad spectrum SPF 15 protection.",
    shortDescription: "Matte finish liquid foundation with SPF 15.",
    price: 3600,
    originalPrice: 3800,
    brand: "MAC",
    sku: "MAC-SFF-NC25",
    images: [{ url: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 65,
    tags: ["makeup", "foundation", "mac", "matte"],
    categoryName: "Makeup"
  },
  {
    name: "Maybelline Lash Sensational Mascara",
    description: "Liquid ink formula with a low wax count creates black lashes that are dark and defined without clumps.",
    shortDescription: "Volumizing black mascara.",
    price: 650,
    originalPrice: 850,
    brand: "Maybelline",
    sku: "MYB-LSH-SENS-BLK",
    images: [{ url: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 140,
    tags: ["makeup", "mascara", "maybelline", "eyes"],
    categoryName: "Makeup"
  },
  {
    name: "Chanel Bleu de Chanel Eau de Parfum",
    description: "An unexpected and undeniably bold fragrance. Fresh, clean, and profoundly sensual, the woody, aromatic fragrance reveals the spirit of a man who chooses his own destiny.",
    shortDescription: "Woody aromatic fragrance for men.",
    price: 11500,
    originalPrice: 12500,
    brand: "Chanel",
    sku: "CHNL-BLEU-EDP-100",
    images: [{ url: "https://images.unsplash.com/photo-1523293115678-d2900f52f228?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 45,
    isFeatured: true,
    tags: ["fragrance", "perfume", "chanel", "men"],
    categoryName: "Fragrances"
  },
  {
    name: "Dior Sauvage Eau de Toilette",
    description: "A radically fresh composition, dictated by a name that has the ring of a manifesto. That was the way François Demachy, Dior Perfumer-Creator, wanted it: raw and noble all at once.",
    shortDescription: "Fresh and noble men's fragrance.",
    price: 10500,
    originalPrice: 11000,
    brand: "Dior",
    sku: "DIOR-SAUV-EDT-100",
    images: [{ url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 55,
    tags: ["fragrance", "cologne", "dior", "men"],
    categoryName: "Fragrances"
  },
  {
    name: "Philips Norelco Multigroom Series 7000",
    description: "All-in-one trimmer for face, head, and body hair styling with 23 precision attachments and self-sharpening blades.",
    shortDescription: "All-in-one men's grooming kit.",
    price: 4500,
    originalPrice: 5500,
    brand: "Philips",
    sku: "PHL-MG7750",
    images: [{ url: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 90,
    tags: ["trimmer", "grooming", "philips", "men"],
    categoryName: "Men's Grooming"
  },
  {
    name: "Bath & Body Works A Thousand Wishes Shower Gel",
    description: "Nourishing shower gel packed with vitamin E and aloe to create a rich, bubbly lather that leaves skin feeling soft and clean.",
    shortDescription: "Festive blend of pink prosecco and crystal peonies.",
    price: 1299,
    originalPrice: 1599,
    brand: "Bath & Body Works",
    sku: "BBW-ATW-SG",
    images: [{ url: "https://images.unsplash.com/photo-1608248593842-808a8d11c828?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 110,
    tags: ["shower gel", "bath", "body care", "wishes"],
    categoryName: "Bath & Body"
  }
];

async function addBeautyProducts() {
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

    console.log("Adding Beauty & Personal Care Products...");
    
    let addedCount = 0;
    
    for (const prodData of BEAUTY_PRODUCTS) {
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

addBeautyProducts();

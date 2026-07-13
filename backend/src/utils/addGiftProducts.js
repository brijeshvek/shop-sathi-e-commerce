import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const GIFT_PRODUCTS = [
  {
    name: "Happy Birthday Deluxe Gift Basket",
    description: "A beautifully arranged birthday basket featuring gourmet chocolates, cookies, premium coffee, and a festive birthday mug.",
    shortDescription: "Gourmet chocolate and coffee birthday basket.",
    price: 3499,
    originalPrice: 3999,
    brand: "Gift Hampers",
    sku: "GFT-BKA-HBD-DLX",
    images: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 50,
    isFeatured: true,
    tags: ["gift", "birthday", "basket", "chocolate"],
    categoryName: "Birthday Gifts"
  },
  {
    name: "Spa Day Relaxation Gift Box",
    description: "Pamper someone special with this luxurious spa box including bath bombs, lavender essential oil, a scented candle, and a plush eye mask.",
    shortDescription: "Luxurious relaxing spa day gift set.",
    price: 2999,
    originalPrice: 3499,
    brand: "Wellness Gifts",
    sku: "GFT-SPA-RLX-BOX",
    images: [{ url: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80", isMain: true }], // spa items
    stock: 80,
    tags: ["gift", "spa", "birthday", "wellness"],
    categoryName: "Birthday Gifts"
  },
  {
    name: "His & Hers Matching Anniversary Watches",
    description: "Elegant matching watch set with stainless steel bands and classic dials, perfect for celebrating a special anniversary.",
    shortDescription: "Matching couple's stainless steel watch set.",
    price: 9999,
    originalPrice: 12999,
    brand: "Timeless",
    sku: "GFT-ANV-WCH-SET",
    images: [{ url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80", isMain: true }], // watches visual
    stock: 25,
    isFeatured: true,
    tags: ["gift", "anniversary", "couple", "watches"],
    categoryName: "Anniversary Gifts"
  },
  {
    name: "Luxury Perfume & Cologne Gift Set",
    description: "A romantic gift set featuring a premium Eau de Parfum and a matching Eau de Toilette, packaged in an elegant velvet box.",
    shortDescription: "Premium couple's fragrance gift set.",
    price: 8500,
    originalPrice: 9500,
    brand: "Aura",
    sku: "GFT-ANV-PRF-SET",
    images: [{ url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", isMain: true }], // perfume visual
    stock: 40,
    tags: ["gift", "anniversary", "perfume", "romantic"],
    categoryName: "Anniversary Gifts"
  },
  {
    name: "Premium Chocolates Assortment Box",
    description: "A massive collection of artisan chocolates, truffles, and pralines to sweeten any festive celebration.",
    shortDescription: "Artisan chocolate assortment for festivals.",
    price: 1999,
    originalPrice: 2499,
    brand: "ChocoLuxe",
    sku: "GFT-FST-CHO-BOX",
    images: [{ url: "https://images.unsplash.com/photo-1548883354-94bcfe321cfa?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 120,
    tags: ["gift", "festival", "chocolate", "sweets"],
    categoryName: "Festival Gifts"
  },
  {
    name: "Diwali Sweets & Diya Hamper",
    description: "Traditional festival hamper containing assorted premium Indian sweets, mixed nuts, and handcrafted clay diyas.",
    shortDescription: "Traditional sweets and diya festival hamper.",
    price: 2499,
    originalPrice: 2999,
    brand: "Festive Joy",
    sku: "GFT-FST-DWL-HMP",
    images: [{ url: "https://images.unsplash.com/photo-1585842841463-b1c4b18c6451?auto=format&fit=crop&w=800&q=80", isMain: true }], // diya/festival visual
    stock: 150,
    tags: ["gift", "festival", "diwali", "sweets"],
    categoryName: "Festival Gifts"
  },
  {
    name: "Personalised Name Necklace (Sterling Silver)",
    description: "Custom-made sterling silver necklace featuring any name of your choice. A beautiful and personal everyday piece.",
    shortDescription: "Custom sterling silver name necklace.",
    price: 2999,
    originalPrice: 3999,
    brand: "CustomGems",
    sku: "GFT-PER-NECK-SS",
    images: [{ url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80", isMain: true }], // jewelry visual
    stock: 200,
    isFeatured: true,
    tags: ["gift", "personalized", "necklace", "jewelry"],
    categoryName: "Personalized Gifts"
  },
  {
    name: "Custom Photo 3D Crystal Lamp",
    description: "Your favorite photo laser-engraved into a solid 3D crystal cube that illuminates with a built-in LED base.",
    shortDescription: "3D crystal lamp with custom photo engraving.",
    price: 3499,
    originalPrice: 4299,
    brand: "CrystalMemories",
    sku: "GFT-PER-3D-LAMP",
    images: [{ url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80", isMain: true }], // general glowing object
    stock: 80,
    tags: ["gift", "personalized", "crystal", "photo"],
    categoryName: "Personalized Gifts"
  },
  {
    name: "Engraved Wooden Keepsake Box",
    description: "Beautifully crafted solid wood box with a personalized engraved lid. Perfect for storing jewelry, photos, or letters.",
    shortDescription: "Personalized engraved wooden memory box.",
    price: 1899,
    originalPrice: 2299,
    brand: "WoodCrafters",
    sku: "GFT-PER-WOOD-BOX",
    images: [{ url: "https://images.unsplash.com/photo-1589146522301-4be3a3038d1f?auto=format&fit=crop&w=800&q=80", isMain: true }], // general wooden box
    stock: 65,
    tags: ["gift", "personalized", "wooden", "keepsake"],
    categoryName: "Personalized Gifts"
  },
  {
    name: "Anniversary Romantic Dinner Voucher (For Two)",
    description: "An open date voucher for a premium 5-course romantic dinner for two at select fine dining partner restaurants.",
    shortDescription: "Fine dining 5-course dinner voucher for two.",
    price: 7500,
    originalPrice: 8500,
    brand: "ExperienceGifts",
    sku: "GFT-ANV-DNR-VCH",
    images: [{ url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80", isMain: true }], // romantic dinner visual
    stock: 100,
    tags: ["gift", "anniversary", "voucher", "experience"],
    categoryName: "Anniversary Gifts"
  }
];

async function addGiftProducts() {
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

    console.log("Adding Gift Shop Products...");
    
    let addedCount = 0;
    
    for (const prodData of GIFT_PRODUCTS) {
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

addGiftProducts();

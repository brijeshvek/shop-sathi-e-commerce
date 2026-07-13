import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const BOOKS_PRODUCTS = [
  {
    name: "The Midnight Library by Matt Haig",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    shortDescription: "A dazzling novel about all the choices that go into a life well lived.",
    price: 499,
    originalPrice: 699,
    brand: "Penguin Books",
    sku: "BK-FIC-MIDLIB",
    images: [{ url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80", isMain: true }], // General fiction book
    stock: 120,
    isFeatured: true,
    tags: ["book", "fiction", "novel", "bestseller"],
    categoryName: "Fiction & Literature"
  },
  {
    name: "1984 by George Orwell",
    description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.",
    shortDescription: "Classic dystopian social science fiction novel.",
    price: 399,
    originalPrice: 499,
    brand: "Signet Classic",
    sku: "BK-FIC-1984",
    images: [{ url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80", isMain: true }], // General book
    stock: 200,
    tags: ["book", "classic", "fiction", "orwell"],
    categoryName: "Fiction & Literature"
  },
  {
    name: "Atomic Habits by James Clear",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear reveals practical strategies to form good habits and break bad ones.",
    shortDescription: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
    price: 599,
    originalPrice: 799,
    brand: "Avery",
    sku: "BK-NFIC-ATMHAB",
    images: [{ url: "https://images.unsplash.com/photo-1589998059171-989d887dda6e?auto=format&fit=crop&w=800&q=80", isMain: true }], // General non-fiction book
    stock: 150,
    isFeatured: true,
    tags: ["book", "self-help", "habits", "productivity"],
    categoryName: "Non-Fiction"
  },
  {
    name: "Sapiens: A Brief History of Humankind",
    description: "Yuval Noah Harari integrates history and science to reconsider accepted narratives, connect past developments with contemporary concerns, and examine specific events within the context of larger ideas.",
    shortDescription: "A groundbreaking narrative of humanity's creation and evolution.",
    price: 799,
    originalPrice: 999,
    brand: "Harper",
    sku: "BK-NFIC-SAPIENS",
    images: [{ url: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 80,
    tags: ["book", "history", "science", "humanity"],
    categoryName: "Non-Fiction"
  },
  {
    name: "Cracking the Coding Interview",
    description: "189 programming interview questions and solutions. Learn how to uncover the hints and hidden details in a question, discover how to break down a problem into manageable chunks.",
    shortDescription: "189 Programming Interview Questions and Solutions.",
    price: 1899,
    originalPrice: 2299,
    brand: "Careercup",
    sku: "BK-ACD-CTCI",
    images: [{ url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80", isMain: true }], // General coding/tech book
    stock: 65,
    isFeatured: true,
    tags: ["book", "coding", "interview", "programming"],
    categoryName: "Academic Books"
  },
  {
    name: "Moleskine Classic Ruled Notebook",
    description: "The classic Moleskine notebook is the heir and successor to the legendary notebook used by artists and thinkers over the past two centuries. Featuring ivory-colored pages, ribbon bookmark and elastic closure.",
    shortDescription: "Large, black, hard cover ruled notebook.",
    price: 1499,
    originalPrice: 1799,
    brand: "Moleskine",
    sku: "STAT-NB-MOL-BLK",
    images: [{ url: "https://images.unsplash.com/photo-1531346878377-a541fa160dcb?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 100,
    tags: ["notebook", "stationery", "moleskine", "journal"],
    categoryName: "Notebooks & Planners"
  },
  {
    name: "Leuchtturm1917 Medium A5 Dotted Hardcover Notebook",
    description: "251 numbered pages of dotted paper. Includes 8 perforated and detachable sheets, expandable pocket, blank table of contents and ribbon page marker.",
    shortDescription: "Premium A5 dotted journal for bullet journaling.",
    price: 1799,
    originalPrice: 2100,
    brand: "Leuchtturm1917",
    sku: "STAT-NB-LEU-A5",
    images: [{ url: "https://images.unsplash.com/photo-1571501679680-a94f6c4d4453?auto=format&fit=crop&w=800&q=80", isMain: true }], // General dotted notebook
    stock: 90,
    tags: ["notebook", "journal", "dotted", "stationery"],
    categoryName: "Notebooks & Planners"
  },
  {
    name: "Pilot G2 Premium Gel Pens (12-Pack)",
    description: "Pilot G2 Premium refillable & retractable rolling ball gel pens are proven to be the longest writing gel ink pen among top brands. Fine point (0.7mm), black ink.",
    shortDescription: "12-Pack Black Fine Point 0.7mm Gel Pens.",
    price: 999,
    originalPrice: 1299,
    brand: "Pilot",
    sku: "STAT-PEN-G2-12PK",
    images: [{ url: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 140,
    tags: ["pens", "office", "gel", "writing"],
    categoryName: "Art & Office Supplies"
  },
  {
    name: "Prismacolor Premier Colored Pencils (72-Count)",
    description: "Artist quality colored pencils for every level of expertise. Colors are easily blended, slow to wear and waterproof.",
    shortDescription: "Soft core colored pencils, set of 72.",
    price: 4999,
    originalPrice: 5999,
    brand: "Prismacolor",
    sku: "STAT-ART-PRS-72",
    images: [{ url: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 35,
    tags: ["pencils", "art", "drawing", "coloring"],
    categoryName: "Art & Office Supplies"
  },
  {
    name: "Post-it Notes 3x3 Inch (14-Pad Cabinet Pack)",
    description: "Post-it Notes stick securely and remove cleanly, featuring a unique adhesive designed for use on paper. Canary Yellow, 100 Sheets/Pad.",
    shortDescription: "Canary Yellow 3x3 Sticky Notes, 14 Pads.",
    price: 1199,
    originalPrice: 1499,
    brand: "Post-it",
    sku: "STAT-OFC-PST-14",
    images: [{ url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 200,
    tags: ["sticky notes", "office", "supplies", "post-it"],
    categoryName: "Art & Office Supplies"
  }
];

async function addBooksProducts() {
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

    console.log("Adding Books & Stationery Products...");
    
    let addedCount = 0;
    
    for (const prodData of BOOKS_PRODUCTS) {
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

addBooksProducts();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';

dotenv.config();

const PET_PRODUCTS = [
  {
    name: "Purina Pro Plan Adult Dog Food (30 lb)",
    description: "High protein dry dog food with probiotics for digestive and immune health, featuring real meat as the first ingredient.",
    shortDescription: "30 lb high protein adult dry dog food.",
    price: 4999,
    originalPrice: 5599,
    brand: "Purina",
    sku: "PET-DF-PUR-PRO-30",
    images: [{ url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80", isMain: true }], // General dog/pet visual
    stock: 80,
    isFeatured: true,
    tags: ["dog food", "dry food", "purina", "pets"],
    categoryName: "Dog Food"
  },
  {
    name: "Blue Buffalo Life Protection Formula Adult Dog Food (30 lb)",
    description: "Formulated for the health and well-being of dogs. Features real meat, whole grains, garden veggies, and fruit.",
    shortDescription: "30 lb natural adult dry dog food.",
    price: 5499,
    originalPrice: 6299,
    brand: "Blue Buffalo",
    sku: "PET-DF-BLUE-LIFE-30",
    images: [{ url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 65,
    tags: ["dog food", "natural", "blue buffalo", "pets"],
    categoryName: "Dog Food"
  },
  {
    name: "Purina ONE Indoor Advantage Adult Cat Food (16 lb)",
    description: "Real turkey is the #1 ingredient in this dry cat food, which also features a natural fiber blend to help minimize hairballs.",
    shortDescription: "16 lb indoor adult dry cat food.",
    price: 2499,
    originalPrice: 2899,
    brand: "Purina ONE",
    sku: "PET-CF-PUR-IND-16",
    images: [{ url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80", isMain: true }], // General cat visual
    stock: 120,
    tags: ["cat food", "dry food", "indoor", "pets"],
    categoryName: "Cat Food"
  },
  {
    name: "IAMS ProActive Health Adult Dry Cat Food (7 lb)",
    description: "Formulated with high-quality protein to help maintain strong muscles, plus omega-6 to promote a healthy skin and coat.",
    shortDescription: "7 lb adult dry cat food with chicken.",
    price: 1599,
    originalPrice: 1899,
    brand: "IAMS",
    sku: "PET-CF-IAMS-PRO-7",
    images: [{ url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 90,
    tags: ["cat food", "dry food", "iams", "pets"],
    categoryName: "Cat Food"
  },
  {
    name: "Best Friends by Sheri The Original Calming Donut Bed",
    description: "Round dog bed features a high-quality faux shag fur to help pets calm down, relax, and sleep soundly.",
    shortDescription: "Calming faux shag fur donut pet bed.",
    price: 3499,
    originalPrice: 4500,
    brand: "Best Friends by Sheri",
    sku: "PET-BED-SHERI-DONUT",
    images: [{ url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 45,
    isFeatured: true,
    tags: ["pet bed", "dog bed", "cat bed", "grooming"],
    categoryName: "Grooming & Beds"
  },
  {
    name: "Furminator Undercoat Deshedding Tool for Dogs",
    description: "Specifically designed to reach through the topcoat to safely and easily remove loose hair and undercoat without damaging the coat.",
    shortDescription: "Undercoat deshedding tool for large dogs.",
    price: 2999,
    originalPrice: 3500,
    brand: "Furminator",
    sku: "PET-GRM-FUR-DESH",
    images: [{ url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 55,
    tags: ["grooming", "brush", "deshedding", "dogs"],
    categoryName: "Grooming & Beds"
  },
  {
    name: "KONG Classic Dog Toy",
    description: "The gold standard of dog toys, offering enrichment by helping satisfy dogs' instinctual needs. Made from ultra-durable red rubber.",
    shortDescription: "Ultra-durable rubber chew and fetch toy.",
    price: 1299,
    originalPrice: 1599,
    brand: "KONG",
    sku: "PET-TOY-KONG-CLASSIC",
    images: [{ url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 200,
    isFeatured: true,
    tags: ["toy", "dog", "chew", "kong"],
    categoryName: "Pet Toys"
  },
  {
    name: "Chuckit! Ultra Ball Dog Toy (2-Pack)",
    description: "Designed for the most demanding use, these high-bounce rubber balls are perfect for a game of fetch. Buoyant and easy to clean.",
    shortDescription: "High-bounce rubber fetch balls (2-pack).",
    price: 999,
    originalPrice: 1299,
    brand: "Chuckit!",
    sku: "PET-TOY-CHUCK-ULT",
    images: [{ url: "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 150,
    tags: ["toy", "dog", "fetch", "ball"],
    categoryName: "Pet Toys"
  },
  {
    name: "SmartyKat Skitter Critters Catnip Cat Toys (3-Pack)",
    description: "Mice cat toys packed with pure, pesticide-free catnip that will drive your cat wild. Designed to mimic real prey.",
    shortDescription: "Catnip filled mice cat toys (3-pack).",
    price: 499,
    originalPrice: 699,
    brand: "SmartyKat",
    sku: "PET-TOY-SMK-MICE",
    images: [{ url: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=800&q=80", isMain: true }], // General cat playing visual
    stock: 300,
    tags: ["toy", "cat", "catnip", "mice"],
    categoryName: "Pet Toys"
  },
  {
    name: "Outward Hound Hide A Squirrel Plush Dog Toy Puzzle",
    description: "Engaging hide-and-seek dog puzzle toy that provides mental stimulation. Includes a plush tree trunk and 3 squeaky squirrels.",
    shortDescription: "Hide-and-seek plush dog puzzle toy.",
    price: 1999,
    originalPrice: 2499,
    brand: "Outward Hound",
    sku: "PET-TOY-OH-SQU",
    images: [{ url: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80", isMain: true }], // General dog visual
    stock: 75,
    tags: ["toy", "dog", "puzzle", "plush"],
    categoryName: "Pet Toys"
  }
];

async function addPetProducts() {
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

    console.log("Adding Pet Supplies Products...");
    
    let addedCount = 0;
    
    for (const prodData of PET_PRODUCTS) {
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

addPetProducts();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';
import Banner from '../models/Banner.model.js';

dotenv.config();

const MAIN_CATEGORIES_DATA = [
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80",
    description: "Gadgets, smartphones, tablets, computers, and home technology.",
    subcategories: [
      "Smartphones", "Tablets", "Laptops", "Desktop Computers", 
      "Computer Components", "Monitors", "Printers & Scanners", 
      "Networking", "Storage Devices", "Smart Home"
    ]
  },
  {
    name: "Mobile Accessories",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80",
    description: "Covers, screen protectors, chargers, and utility add-ons.",
    subcategories: [
      "Phone Cases", "Screen Protectors", "Chargers", "Power Banks",
      "Cables", "Earbuds & Headphones", "Smartwatches", "Phone Holders"
    ]
  },
  {
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    description: "Apparel and accessories for men, women, and kids.",
    subcategories: [
      "Men's Clothing", "Women's Clothing", "Kids Clothing", "Footwear", "Watches", "Bags & Wallets"
    ]
  },
  {
    name: "Beauty & Personal Care",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    description: "Cosmetics, skincare products, fragrances, and tools.",
    subcategories: [
      "Skincare", "Hair Care", "Makeup", "Fragrances", "Men's Grooming", "Bath & Body", "Beauty Tools"
    ]
  },
  {
    name: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    description: "Furniture, appliances, cookware, and decorative solutions.",
    subcategories: [
      "Furniture", "Kitchen Appliances", "Cookware", "Home Decor", "Lighting", "Bedding"
    ]
  },
  {
    name: "Grocery & Essentials",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    description: "Daily fresh essentials, staples, grains, and beverages.",
    subcategories: [
      "Fruits & Vegetables", "Dairy Products", "Snacks & Beverages", "Rice & Grains", "Spices & Oils"
    ]
  },
  {
    name: "Health & Wellness",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    description: "Supplements, medical supplies, and fitness nutrition.",
    subcategories: [
      "Vitamins & Supplements", "Medical Equipment", "Fitness Nutrition", "Wellness Products"
    ]
  },
  {
    name: "Sports & Fitness",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    description: "Gear and equipment for gyms, yoga, and outdoor games.",
    subcategories: [
      "Gym Equipment", "Yoga Equipment", "Sports Gear", "Cycling & Running", "Fitness Accessories"
    ]
  },
  {
    name: "Books & Stationery",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
    description: "Reading collections, writing journals, and office supplies.",
    subcategories: [
      "Fiction & Literature", "Non-Fiction", "Academic Books", "Notebooks & Planners", "Art & Office Supplies"
    ]
  },
  {
    name: "Toys & Games",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    description: "Educational puzzles, building blocks, and dolls.",
    subcategories: [
      "Educational Toys", "Board Games & Puzzles", "Action Figures & Dolls", "RC Toys"
    ]
  },
  {
    name: "Automotive",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80",
    description: "Car & bike utility accessories, helmets, and care oils.",
    subcategories: [
      "Car Accessories", "Bike Accessories", "Helmets & Safety", "Car Care & Engine Oils"
    ]
  },
  {
    name: "Pet Supplies",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80",
    description: "Nutritious foods, beds, and interactive toys for pets.",
    subcategories: [
      "Dog Food", "Cat Food", "Grooming & Beds", "Pet Toys"
    ]
  },
  {
    name: "Gift Shop",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    description: "Personalized gifts, birthday items, and corporate giveaways.",
    subcategories: [
      "Birthday Gifts", "Anniversary Gifts", "Festival Gifts", "Personalized Gifts"
    ]
  },
  {
    name: "Seasonal Collections",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    description: "Collections curated for summer, winter, and special festivals.",
    subcategories: [
      "Summer Collection", "Winter Collection", "Festival Specials", "Back-to-School"
    ]
  }
];

const SEED_PRODUCTS = [
  {
    name: "OnePlus 12 5G (Flowy Emerald)",
    description: "Flagship smartphone featuring Snapdragon 8 Gen 3, 16GB LPDDR5X RAM, 512GB UFS 4.0 storage, and 4th Gen Hasselblad Camera System for mobile.",
    shortDescription: "Snapdragon 8 Gen 3, Hasselblad Camera, 100W SuperVOOC Charging.",
    price: 64999,
    originalPrice: 69999,
    brand: "OnePlus",
    sku: "OP-12-FE-512G",
    images: [{ url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 25,
    isFeatured: true,
    tags: ["smartphone", "oneplus", "flagship", "5g"],
    specifications: [
      { key: "Processor", value: "Snapdragon 8 Gen 3" },
      { key: "RAM", value: "16 GB" },
      { key: "Storage", value: "512 GB" }
    ],
    categoryName: "Smartphones"
  },
  {
    name: "iPad Air 11-inch (M2 Chip)",
    description: "The redesigned iPad Air with M2 chip, a stunning Liquid Retina display, landscape front camera, and ultra-fast Wi-Fi 6E connectivity.",
    shortDescription: "Apple M2 Chip, 11-inch Liquid Retina Display, 128GB.",
    price: 54900,
    originalPrice: 59900,
    brand: "Apple",
    sku: "APL-IPDA-M2-128",
    images: [{ url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 12,
    isFeatured: true,
    tags: ["tablet", "ipad", "apple", "m2"],
    specifications: [
      { key: "Chip", value: "Apple M2" },
      { key: "Display", value: "11-inch Liquid Retina" }
    ],
    categoryName: "Tablets"
  },
  {
    name: "MacBook Air 13-inch M3",
    description: "Superlight and incredibly fast MacBook Air with Apple M3 chip, up to 18 hours of battery life, and a brilliant Liquid Retina display.",
    shortDescription: "M3 chip, 8GB RAM, 256GB SSD, Space Grey.",
    price: 99900,
    originalPrice: 114900,
    brand: "Apple",
    sku: "APL-MBA-M3-256",
    images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 18,
    isFeatured: true,
    tags: ["laptop", "macbook", "apple", "m3"],
    specifications: [
      { key: "Processor", value: "Apple M3" },
      { key: "Memory", value: "8 GB Unified" },
      { key: "Storage", value: "256 GB SSD" }
    ],
    categoryName: "Laptops"
  },
  {
    name: "Spigen Liquid Air Case for iPhone 15 Pro",
    description: "Premium flexible TPU matte protection case with geometric pattern design for secure grip.",
    shortDescription: "Matte Black protective TPU cover.",
    price: 1299,
    originalPrice: 1999,
    brand: "Spigen",
    sku: "SPG-LA-IP15P-MB",
    images: [{ url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 50,
    tags: ["case", "iphone 15", "spigen", "cover"],
    specifications: [
      { key: "Material", value: "TPU" },
      { key: "Color", value: "Matte Black" }
    ],
    categoryName: "Phone Cases"
  },
  {
    name: "Anker 737 Power Bank (PowerCore 24K)",
    description: "Ultra-high capacity power bank with 140W fast charge smart display, 24,000mAh backup capacity.",
    shortDescription: "140W two-way fast charge power bank with screen.",
    price: 9999,
    originalPrice: 14999,
    brand: "Anker",
    sku: "ANK-737-24K-140W",
    images: [{ url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 30,
    tags: ["powerbank", "anker", "charger", "portable"],
    categoryName: "Power Banks"
  },
  {
    name: "Casual Slim Fit Linen Shirt",
    description: "Premium quality breathable lightweight linen shirt for men. Styled with a classic spread collar and button cuffs.",
    shortDescription: "100% Linen regular fit casual shirt.",
    price: 1899,
    originalPrice: 2999,
    brand: "Peter England",
    sku: "PE-LS-LSN-WHT",
    images: [{ url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 45,
    tags: ["shirt", "men", "linen", "fashion"],
    categoryName: "Men's Clothing"
  },
  {
    name: "Floral A-Line Summer Dress",
    description: "Charming floral print georgette maxi dress featuring a matching waist tie and long puff sleeves.",
    shortDescription: "Floral print georgette A-line dress.",
    price: 2499,
    originalPrice: 3999,
    brand: "Zara",
    sku: "ZR-FD-FLR-MX",
    images: [{ url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 20,
    tags: ["dress", "women", "fashion", "floral"],
    categoryName: "Women's Clothing"
  },
  {
    name: "Minimalist Leather Watch",
    description: "Sleek analog wrist watch with genuine tan leather straps, white dial case, and water resistance up to 50m.",
    shortDescription: "Classic analog watch with tan leather straps.",
    price: 4999,
    originalPrice: 7999,
    brand: "Fossil",
    sku: "FSL-MIN-LT-TN",
    images: [{ url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 15,
    tags: ["watch", "accessories", "leather", "timepiece"],
    categoryName: "Watches"
  },
  {
    name: "Hydrating Hyaluronic Acid Serum",
    description: "Deep moisture-binding skin serum formulated with pure botanical extracts and multi-weight hyaluronic acid.",
    shortDescription: "Intense hydration facial serum.",
    price: 799,
    originalPrice: 1299,
    brand: "The Derma Co",
    sku: "TDC-HAS-30ML",
    images: [{ url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 100,
    tags: ["skincare", "serum", "beauty", "hydrate"],
    categoryName: "Skincare"
  },
  {
    name: "Prestige Induction Cooktop (2000W)",
    description: "Highly efficient quick heat induction cooktop featuring automatic voltage regulator and pre-set Indian menu panels.",
    shortDescription: "2000 Watts smart push-button induction cooktop.",
    price: 3299,
    originalPrice: 4999,
    brand: "Prestige",
    sku: "PRST-IC-2000W",
    images: [{ url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", isMain: true }],
    stock: 22,
    tags: ["appliance", "cooktop", "kitchen", "prestige"],
    categoryName: "Kitchen Appliances"
  }
];

const SEED_BANNERS = [
  {
    title: "Summer Collection 2026",
    subtitle: "Up to 50% off on all new arrivals fashion wear",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2070&q=80",
    link: "/products",
    bannerType: "hero",
    isActive: true
  },
  {
    title: "Smart Home Tech Evolution",
    subtitle: "Upgrade your living space today with up to 25% off",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=2070&q=80",
    link: "/products",
    bannerType: "hero",
    isActive: true
  },
  {
    title: "Mega Monsoon Special Coupon!",
    subtitle: "Get flat 20% OFF on all catalog products.",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=2070&q=80",
    link: "/products",
    bannerType: "coupon",
    discountCode: "MONSOON20",
    isActive: true
  },
  {
    title: "Fresh & Organic Grocery Sale",
    subtitle: "Farm fresh essentials delivered to your doorstep",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2070&q=80",
    link: "/products",
    bannerType: "hero",
    isActive: true
  },
  {
    title: "Exclusive Tech Electronics Offers",
    subtitle: "Smartphones, tablets, and accessories on special pricing.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=2070&q=80",
    link: "/products",
    bannerType: "offer",
    isActive: true
  }
];

async function seedData() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined.");
      process.exit(1);
    }

    console.log("Connecting to database Cluster...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    // Check if there is an admin/seller user to assign as creator
    let user = await User.findOne({ role: { $in: ['admin', 'superadmin', 'seller'] } });
    if (!user) {
      console.log("No default seller/admin user found. Creating dummy seller user...");
      user = await User.create({
        name: "ShopShathi Merchant",
        email: "merchant@shopshathi.com",
        password: "DefaultSecurePassword123!",
        role: "seller",
        isEmailVerified: true
      });
      console.log(`Created dummy seller: ${user.email}`);
    }

    console.log("Clearing existing products, categories and banners...");
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Banner.deleteMany({});
    console.log("Previous database items dropped.");

    console.log("Seeding Categories and Subcategories...");
    const categoryNameToIdMap = {};

    for (const catData of MAIN_CATEGORIES_DATA) {
      // Create main category
      const mainCat = await Category.create({
        name: catData.name,
        description: catData.description,
        image: { url: catData.image, publicId: 'unsplash_seed' },
        parent: null
      });
      
      console.log(`Created Main Category: ${mainCat.name}`);
      categoryNameToIdMap[mainCat.name] = mainCat._id;

      // Create subcategories under this parent
      for (const subName of catData.subcategories) {
        const subCat = await Category.create({
          name: subName,
          description: `Shop high-quality ${subName.toLowerCase()} in our ${catData.name.toLowerCase()} catalog.`,
          image: { url: catData.image, publicId: 'unsplash_seed_sub' },
          parent: mainCat._id
        });
        categoryNameToIdMap[subName] = subCat._id;
      }
    }

    console.log("Seeding Premium Products...");
    for (const prodData of SEED_PRODUCTS) {
      const categoryId = categoryNameToIdMap[prodData.categoryName];
      if (!categoryId) {
        console.warn(`Category not found for product: ${prodData.name} (${prodData.categoryName}). Skipping.`);
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
        category: categoryId,
        createdBy: user._id,
        seller: user._id
      });
      console.log(`Seeded Product: ${prodData.name}`);
    }

    console.log("Seeding Premium Banners...");
    for (const bannerData of SEED_BANNERS) {
      await Banner.create(bannerData);
      console.log(`Seeded Banner: ${bannerData.title} (${bannerData.bannerType})`);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding operation failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedData();

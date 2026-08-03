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
    images: [
      { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
    stock: 25,
    isFeatured: true,
    tags: ["smartphone", "oneplus", "flagship", "5g"],
    specifications: [
      { key: "Processor", value: "Snapdragon 8 Gen 3" },
      { key: "RAM", value: "16 GB" },
      { key: "Storage", value: "512 GB" }
    ],
    attributes: {
      ram: "16 GB",
      storage: "512 GB",
      processor: "Snapdragon 8 Gen 3",
      os: "Android",
      connectivity: ["5G", "WiFi 6E", "NFC"]
    },
    dimensions: {
      weight: 220,
      height: 16,
      width: 7,
      length: 1
    },
    certifications: {
      bis: true,
      isi: true,
      ce: true,
      fcc: true,
      rohs: true
    },
    warranty: {
      period: "1 Year",
      type: "Brand Warranty"
    },
    shipping: {
      deliveryTimeDays: 3,
      freeShipping: true
    },
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
    images: [
      { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1541877944-ac82a091518a?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
    stock: 22,
    tags: ["appliance", "cooktop", "kitchen", "prestige"],
    categoryName: "Kitchen Appliances"
  },
  {
    name: "Samsung Galaxy S24 Ultra 5G",
    description: "AI-powered flagship smartphone featuring Snapdragon 8 Gen 3, titanium frame, and 200MP camera system.",
    shortDescription: "Snapdragon 8 Gen 3, 200MP Camera, Titanium Frame.",
    price: 129999,
    originalPrice: 134999,
    brand: "Samsung",
    sku: "SAM-S24U-256G",
    images: [
      { url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1544122860-15632120db37?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
    stock: 18,
    isFeatured: true,
    tags: ["tablet", "windows", "surface", "microsoft"],
    specifications: [
      { key: "Processor", value: "Intel Core i7 12th Gen" },
      { key: "RAM", value: "16 GB" },
      { key: "Storage", value: "512 GB SSD" }
    ],
    categoryName: "Tablets"
  },
  {
    name: "OtterBox Defender Series Case for Galaxy S24 Ultra",
    description: "Rugged multi-layer defense case with a solid inner shell, resilient outer slipcover, and a holster that doubles as a kickstand.",
    shortDescription: "Multi-layer drop protection case.",
    price: 4999,
    originalPrice: 5999,
    brand: "OtterBox",
    sku: "OTB-DEF-S24U-BLK",
    images: [
      { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1541877944-ac82a091518a?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1622445268465-8431b68a4202?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1606220588913-b3eea8951234?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1606220588913-b3eea8951234?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1434493789847-2f02b0c156f4?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
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
    images: [
      { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1541877944-ac82a091518a?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
    stock: 75,
    tags: ["holder", "mount", "car accessory", "iottie"],
    categoryName: "Phone Holders"
  },
  {
    name: "Mobil 1 Extended Performance Full Synthetic Motor Oil 5W-30",
    description: "Advanced full synthetic motor oil designed to protect critical engine parts for up to 20,000 miles between oil changes, keeping your engine running like new.",
    shortDescription: "Advanced Full Synthetic Motor Oil 5W-30, 20,000 miles protection.",
    price: 3499,
    originalPrice: 4200,
    brand: "Mobil 1",
    sku: "M1-EP-FS-5W30",
    images: [
      { url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80", isMain: true },
      { url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80", isMain: false },
      { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", isMain: false }
    ],
    stock: 50,
    isFeatured: true,
    tags: ["motor oil", "engine oil", "mobil 1", "automotive", "synthetic"],
    specifications: [
      { key: "Viscosity", value: "5W-30" },
      { key: "Oil Type", value: "Full Synthetic" },
      { key: "Protection", value: "Up to 20,000 Miles" }
    ],
    categoryName: "Car Accessories"
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
        phone: "9876543210",
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
        attributes: prodData.attributes || {},
        dimensions: prodData.dimensions || {},
        certifications: prodData.certifications || {},
        warranty: prodData.warranty || {},
        shipping: prodData.shipping || {},
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

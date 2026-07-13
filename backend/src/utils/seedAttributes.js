import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Category from '../models/Category.model.js'
import CategoryAttribute from '../models/CategoryAttribute.model.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') })

const CATEGORY_SCHEMAS = {
  "Electronics": [
    { key: "ram", label: "RAM", type: "select", options: ["2 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB", "32 GB", "64 GB"], required: true, defaultValue: "8 GB" },
    { key: "storage", label: "Storage", type: "select", options: ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "2 TB"], required: true, defaultValue: "256 GB" },
    { key: "processor", label: "Processor", type: "text", required: true, defaultValue: "" },
    { key: "displaySize", label: "Display Size (inches)", type: "number", required: false, defaultValue: "" },
    { key: "resolution", label: "Screen Resolution", type: "select", options: ["FHD (1920x1080)", "QHD (2560x1440)", "4K UHD (3840x2160)", "Retina Display"], required: false, defaultValue: "FHD (1920x1080)" },
    { key: "refreshRate", label: "Refresh Rate", type: "select", options: ["60 Hz", "90 Hz", "120 Hz", "144 Hz", "240 Hz"], required: false, defaultValue: "60 Hz" },
    { key: "battery", label: "Battery Capacity (mAh)", type: "number", required: false, defaultValue: "" },
    { key: "fastCharging", label: "Fast Charging Support", type: "checkbox", required: false, defaultValue: false },
    { key: "os", label: "Operating System", type: "select", options: ["Windows 11", "Windows 10", "macOS", "Android", "iOS", "Linux"], required: true, defaultValue: "Windows 11" },
    { key: "camera", label: "Camera Specifications", type: "text", required: false, defaultValue: "" },
    { key: "connectivity", label: "Connectivity", type: "multiselect", options: ["5G", "4G LTE", "WiFi 6E", "WiFi 7", "Bluetooth 5.3", "NFC"], required: true, defaultValue: [] },
    { key: "bluetooth", label: "Bluetooth Version", type: "select", options: ["5.0", "5.1", "5.2", "5.3", "5.4"], required: false, defaultValue: "5.3" },
    { key: "wifi", label: "WiFi Enabled", type: "checkbox", required: false, defaultValue: true },
    { key: "usbType", label: "USB Interface Type", type: "select", options: ["USB-C", "USB-A", "Micro-USB", "Lightning"], required: false, defaultValue: "USB-C" },
    { key: "hdmi", label: "HDMI Port", type: "checkbox", required: false, defaultValue: false },
    { key: "audioJack", label: "3.5mm Audio Jack", type: "checkbox", required: false, defaultValue: true },
    { key: "graphics", label: "Graphics Processing Unit (GPU)", type: "text", required: false, defaultValue: "" },
    { key: "powerWatts", label: "Power Consumption (Watts)", type: "number", required: false, defaultValue: "" },
    { key: "voltage", label: "Operating Voltage", type: "select", options: ["110V", "220V", "Universal Voltage (100V-240V)"], required: false, defaultValue: "Universal Voltage (100V-240V)" },
    { key: "frequency", label: "Operating Frequency", type: "select", options: ["50 Hz", "60 Hz", "50-60 Hz"], required: false, defaultValue: "50-60 Hz" },
    { key: "warrantyPeriod", label: "Warranty Period", type: "select", options: ["6 Months", "1 Year", "2 Years", "3 Years", "No Warranty"], required: true, defaultValue: "1 Year" },
    { key: "boxContents", label: "In the Box Contents", type: "text", required: true, defaultValue: "" }
  ],
  "Mobile Accessories": [
    { key: "compatibles", label: "Compatible Devices", type: "multiselect", options: ["iPhone 15 Series", "iPhone 14 Series", "Galaxy S24 Ultra", "Galaxy S23 Series", "OnePlus 12", "Universal Compatibility"], required: true, defaultValue: [] },
    { key: "connector", label: "Connector Type", type: "select", options: ["USB-C to USB-C", "USB-A to USB-C", "USB-C to Lightning", "Wireless MagSafe", "Micro-USB"], required: true, defaultValue: "USB-C to USB-C" },
    { key: "length", label: "Cable Length", type: "select", options: ["0.5m", "1m", "1.5m", "2m", "3m", "Not Applicable"], required: false, defaultValue: "1m" },
    { key: "chargingSpeed", label: "Charging Speed / Output", type: "select", options: ["15W", "18W", "20W", "33W", "45W", "65W", "100W", "120W"], required: false, defaultValue: "20W" },
    { key: "outputPower", label: "Output Ports Configuration", type: "text", required: false, defaultValue: "" },
    { key: "material", label: "Build Material", type: "select", options: ["Nylon Braided", "TPE / Rubber", "Hard Plastic", "Silicone", "Aluminium Alloy"], required: true, defaultValue: "TPE / Rubber" },
    { key: "color", label: "Color", type: "select", options: ["Black", "White", "Gray", "Blue", "Red", "Silver"], required: true, defaultValue: "Black" },
    { key: "warranty", label: "Warranty Period", type: "select", options: ["3 Months", "6 Months", "1 Year", "2 Years", "No Warranty"], required: true, defaultValue: "1 Year" }
  ],
  "Fashion": [
    { key: "gender", label: "Gender Target", type: "select", options: ["Men", "Women", "Unisex", "Boys", "Girls", "Infants"], required: true, defaultValue: "Unisex" },
    { key: "ageGroup", label: "Age Group", type: "select", options: ["Adults", "Teens", "Kids", "Toddlers", "Newborns"], required: true, defaultValue: "Adults" },
    { key: "fabric", label: "Fabric / Material", type: "select", options: ["100% Cotton", "Polyester", "Wool", "Linen", "Silk", "Denim", "Nylon", "Rayon", "Synthetic Blend"], required: true, defaultValue: "100% Cotton" },
    { key: "sleeve", label: "Sleeve Type", type: "select", options: ["Short Sleeve", "Full Sleeve", "3/4 Sleeve", "Half Sleeve", "Sleeveless", "Not Applicable"], required: false, defaultValue: "Short Sleeve" },
    { key: "collar", label: "Collar Type", type: "select", options: ["Spread Collar", "Classic Collar", "Mandarin Collar", "Button-Down Collar", "None"], required: false, defaultValue: "None" },
    { key: "neckType", label: "Neck Style", type: "select", options: ["Round Neck", "V-Neck", "Crew Neck", "Boat Neck", "Hooded", "Not Applicable"], required: false, defaultValue: "Round Neck" },
    { key: "pattern", label: "Pattern", type: "select", options: ["Solid", "Striped", "Checked", "Printed", "Graphic", "Self Design", "Washed"], required: true, defaultValue: "Solid" },
    { key: "occasion", label: "Occasion", type: "select", options: ["Casual", "Formal", "Party Wear", "Sports / Gym", "Festive", "Lounge Wear"], required: true, defaultValue: "Casual" },
    { key: "season", label: "Recommended Season", type: "multiselect", options: ["Summer", "Winter", "Spring/Autumn", "Monsoon", "All Seasons"], required: true, defaultValue: ["All Seasons"] },
    { key: "fit", label: "Fit Type", type: "select", options: ["Regular Fit", "Slim Fit", "Loose Fit", "Oversized", "Skinny Fit"], required: true, defaultValue: "Regular Fit" },
    { key: "stretchable", label: "Stretchable Fabric", type: "checkbox", required: false, defaultValue: false },
    { key: "closure", label: "Closure Type", type: "select", options: ["Buttons", "Zipper", "Elastic / Pull On", "Drawstring", "Hook & Eye", "No Closure"], required: false, defaultValue: "Buttons" },
    { key: "hasPockets", label: "Has Pockets", type: "checkbox", required: false, defaultValue: true },
    { key: "washCare", label: "Wash Care Instructions", type: "select", options: ["Machine Wash Cold", "Hand Wash Recommended", "Dry Clean Only", "Do Not Bleach"], required: true, defaultValue: "Machine Wash Cold" },
    { key: "colorsList", label: "Available Colors", type: "multiselect", options: ["Black", "White", "Navy Blue", "Olive Green", "Charcoal", "Red", "Beige", "Pink"], required: true, defaultValue: [] },
    { key: "sizeChart", label: "Size Chart Link (URL)", type: "text", required: false, defaultValue: "" },
    { key: "sizes", label: "Available Sizes", type: "multiselect", options: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "28", "30", "32", "34", "36", "38", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"], required: true, defaultValue: [] },
    { key: "origin", label: "Country of Origin", type: "select", options: ["India", "Vietnam", "Bangladesh", "China", "Italy", "USA"], required: true, defaultValue: "India" }
  ],
  "Beauty & Personal Care": [
    { key: "skinType", label: "Skin Type Compatibility", type: "select", options: ["All Skin Types", "Dry Skin", "Oily Skin", "Sensitive Skin", "Combination Skin", "Acne-Prone Skin"], required: true, defaultValue: "All Skin Types" },
    { key: "hairType", label: "Hair Type Compatibility", type: "select", options: ["All Hair Types", "Dry & Damaged", "Oily Scalp", "Curly/Frizzy Hair", "Fine/Thin Hair", "Color Treated Hair"], required: false, defaultValue: "All Hair Types" },
    { key: "ingredients", label: "Key Ingredients", type: "text", required: true, defaultValue: "" },
    { key: "benefits", label: "Primary Benefits", type: "multiselect", options: ["Moisturizing", "Anti-Aging", "Brightening / Glow", "Acne Control", "Sun Protection", "Exfoliating", "Hair Fall Control"], required: true, defaultValue: [] },
    { key: "fragrance", label: "Fragrance Notes", type: "text", required: false, defaultValue: "" },
    { key: "spf", label: "SPF Factor", type: "select", options: ["None / No SPF", "SPF 15", "SPF 30", "SPF 50", "SPF 50+ PA+++", "SPF 100"], required: true, defaultValue: "None / No SPF" },
    { key: "expiryDate", label: "Expiry Date", type: "date", required: true, defaultValue: "" },
    { key: "shelfLife", label: "Shelf Life after Opening", type: "select", options: ["3 Months", "6 Months", "12 Months", "24 Months", "36 Months"], required: true, defaultValue: "24 Months" },
    { key: "directions", label: "Directions for Use", type: "text", required: true, defaultValue: "" },
    { key: "netQuantity", label: "Net Quantity / Volume", type: "text", required: true, defaultValue: "100 ml" },
    { key: "isDerma", label: "Dermatologically Tested", type: "checkbox", required: true, defaultValue: true },
    { key: "isOrganic", label: "100% Organic Product", type: "checkbox", required: true, defaultValue: false },
    { key: "crueltyFree", label: "Cruelty Free Certification", type: "checkbox", required: true, defaultValue: true }
  ],
  "Home & Kitchen": [
    { key: "material", label: "Primary Material", type: "select", options: ["Stainless Steel", "Ceramic / Porcelain", "Teak Wood", "Engineered Wood", "BPA-Free Plastic", "Glass", "Cast Iron", "Aluminium"], required: true, defaultValue: "Stainless Steel" },
    { key: "capacity", label: "Capacity / Volume", type: "select", options: ["500 ml", "1 Liter", "2 Liters", "5 Liters", "10 Liters", "250 ml", "Not Applicable"], required: false, defaultValue: "1 Liter" },
    { key: "color", label: "Color / Finish", type: "select", options: ["Silver", "Black", "Red", "White", "Brown", "Rose Gold", "Brushed Metal"], required: true, defaultValue: "Silver" },
    { key: "finish", label: "Finish Type", type: "select", options: ["Matte", "Glossy", "Polished Chrome", "Powder Coated", "Natural Wood Grain"], required: false, defaultValue: "Matte" },
    { key: "installType", label: "Installation Mechanism", type: "select", options: ["Free Standing", "Wall Mounted", "Countertop Placement", "Built-In", "No Assembly Required"], required: false, defaultValue: "Free Standing" },
    { key: "powerWatts", label: "Power Rating (Watts)", type: "number", required: false, defaultValue: "" },
    { key: "voltage", label: "Voltage Required", type: "select", options: ["220V-240V", "110V-120V", "Dual Voltage", "Battery Operated"], required: false, defaultValue: "220V-240V" },
    { key: "dishwasher", label: "Dishwasher Safe", type: "checkbox", required: true, defaultValue: false },
    { key: "microwave", label: "Microwave Safe", type: "checkbox", required: true, defaultValue: false },
    { key: "warranty", label: "Warranty Period", type: "select", options: ["6 Months", "1 Year", "2 Years", "5 Years", "No Warranty"], required: true, defaultValue: "1 Year" }
  ],
  "Grocery & Essentials": [
    { key: "packSize", label: "Pack Size / Net Weight", type: "select", options: ["100 g", "250 g", "500 g", "1 kg", "5 kg", "10 kg", "200 ml", "500 ml", "1 Liter", "5 Liters"], required: true, defaultValue: "1 kg" },
    { key: "expiryDate", label: "Expiration Date", type: "date", required: true, defaultValue: "" },
    { key: "mfgDate", label: "Manufacturing Date", type: "date", required: true, defaultValue: "" },
    { key: "ingredients", label: "Ingredients Listing", type: "text", required: true, defaultValue: "" },
    { key: "nutritional", label: "Nutritional Value Facts", type: "text", required: true, defaultValue: "" },
    { key: "storage", label: "Storage Guidelines", type: "select", options: ["Store in a cool, dry place", "Refrigerate after opening", "Keep frozen below -18°C", "Keep away from direct sunlight"], required: true, defaultValue: "Store in a cool, dry place" },
    { key: "isOrganic", label: "Certified Organic", type: "checkbox", required: true, defaultValue: false },
    { key: "foodType", label: "Veg / Non-Veg Classification", type: "select", options: ["Veg", "Non-Veg", "Eggitarian"], required: true, defaultValue: "Veg" },
    { key: "packaging", label: "Packaging Container Type", type: "select", options: ["Pouch Bag", "Glass Jar", "Tin Can", "Plastic Bottle", "Paper Box / Carton"], required: true, defaultValue: "Pouch Bag" }
  ],
  "Health & Wellness": [
    { key: "suppType", label: "Supplement Classification", type: "select", options: ["Whey Protein", "Multivitamins", "Herbal / Ayurvedic", "Omega-3 Fish Oil", "Probiotics", "Collagen Powder", "Weight Gainers"], required: true, defaultValue: "Multivitamins" },
    { key: "ingredients", label: "Active Ingredients List", type: "text", required: true, defaultValue: "" },
    { key: "dosage", label: "Dosage Guidelines", type: "text", required: true, defaultValue: "1 Tablet daily after meals" },
    { key: "ageGroup", label: "Age Suitability", type: "select", options: ["Adults (18+)", "Senior Citizens (60+)", "Kids / Children", "Infants", "Pregnancy Safe Only"], required: true, defaultValue: "Adults (18+)" },
    { key: "expiryDate", label: "Expiry Date", type: "date", required: true, defaultValue: "" },
    { key: "storage", label: "Storage Guidelines", type: "select", options: ["Store below 25°C in dry place", "Keep in dry container", "Refrigerate at 2-8°C"], required: true, defaultValue: "Store below 25°C in dry place" },
    { key: "rxRequired", label: "Doctor Prescription Required", type: "checkbox", required: true, defaultValue: false },
    { key: "certs", label: "Safety & Quality Certifications", type: "multiselect", options: ["FSSAI Approved", "FDA Compliant", "GMP Certified", "USP Verified", "ISO 9001"], required: true, defaultValue: ["FSSAI Approved"] }
  ],
  "Sports & Fitness": [
    { key: "sportType", label: "Sport Category", type: "select", options: ["Gym / Weightlifting", "Yoga & Pilates", "Cricket", "Football / Soccer", "Badminton", "Basketball", "Running / Athletics", "Cycling"], required: true, defaultValue: "Gym / Weightlifting" },
    { key: "material", label: "Material Composition", type: "select", options: ["Carbon Fiber", "Aluminium Alloy", "Cast Iron / Rubber Coated", "TPE / Natural Rubber", "Polyester Blend"], required: true, defaultValue: "Carbon Fiber" },
    { key: "grip", label: "Grip Size / Type", type: "select", options: ["G1 (Small)", "G2 (Medium-Small)", "G3 (Medium)", "G4 (Large)", "No Grip Specification"], required: false, defaultValue: "No Grip Specification" },
    { key: "skill", label: "Target Skill Level", type: "select", options: ["Beginner friendly", "Intermediate players", "Professional / Advanced Use"], required: true, defaultValue: "Beginner friendly" },
    { key: "environment", label: "Usage Environment", type: "select", options: ["Indoor Only", "Outdoor Only", "Dual Purpose (Indoor/Outdoor)"], required: true, defaultValue: "Dual Purpose (Indoor/Outdoor)" },
    { key: "waterproof", label: "Waterproof / Resistance", type: "select", options: ["Not Waterproof", "Water Resistant (Splash Proof)", "IP67 Waterproof", "IP68 Waterproof / Submersible"], required: true, defaultValue: "Not Waterproof" }
  ],
  "Books & Stationery": [
    { key: "author", label: "Author's Name", type: "text", required: true, defaultValue: "" },
    { key: "publisher", label: "Publishing House", type: "text", required: true, defaultValue: "" },
    { key: "language", label: "Book Language", type: "select", options: ["English", "Hindi", "Gujarati", "Spanish", "French", "German"], required: true, defaultValue: "English" },
    { key: "isbn", label: "ISBN-13 Bar Number", type: "text", required: true, defaultValue: "" },
    { key: "edition", label: "Edition Number", type: "text", required: false, defaultValue: "First Edition" },
    { key: "pages", label: "Total Page Count", type: "number", required: true, defaultValue: "" },
    { key: "publishDate", label: "Original Publication Date", type: "date", required: false, defaultValue: "" },
    { key: "genre", label: "Book Genre", type: "select", options: ["Self-Help & Business", "Fiction & Novel", "Technology & Coding", "Academic & Textbooks", "Children's Literature", "Biographies & History"], required: true, defaultValue: "Self-Help & Business" },
    { key: "coverType", label: "Book Cover Format", type: "select", options: ["Paperback", "Hardcover", "Spiral / Wire Bound", "E-Book Edition"], required: true, defaultValue: "Paperback" },
    { key: "paperType", label: "Paper Density / GSM", type: "select", options: ["70 GSM Cream Paper", "80 GSM White Paper", "100 GSM Bond Paper", "Recycled Eco Paper"], required: false, defaultValue: "70 GSM Cream Paper" }
  ],
  "Toys & Games": [
    { key: "ageRec", label: "Recommended Age Bracket", type: "select", options: ["0 - 12 Months", "1 - 3 Years", "3 - 5 Years", "5 - 8 Years", "8 - 12 Years", "12+ Teen & Adult"], required: true, defaultValue: "3 - 5 Years" },
    { key: "material", label: "Safe Build Material", type: "select", options: ["BPA-Free ABS Plastic", "Natural Teak Wood", "Organic Cotton / Plush Fabric", "Non-Toxic Cardboard / Paper"], required: true, defaultValue: "BPA-Free ABS Plastic" },
    { key: "safety", label: "Safety Standard Conformity", type: "multiselect", options: ["EN71 European Toy Safety", "ASTM F963 US Safety Standard", "BIS IS 9873 Certified", "CE Quality Compliant"], required: true, defaultValue: ["CE Quality Compliant"] },
    { key: "batteryReq", label: "Batteries Required", type: "checkbox", required: true, defaultValue: false },
    { key: "isEdu", label: "Educational Value / Toy", type: "checkbox", required: true, defaultValue: false },
    { key: "skills", label: "Skills Developed", type: "multiselect", options: ["Motor Coordination", "Logical Reasoning", "Creativity & Imagination", "Social / Cooperative Skills"], required: false, defaultValue: [] },
    { key: "pieces", label: "Total Toy Pieces Count", type: "number", required: false, defaultValue: 1 },
    { key: "theme", label: "Game Play Theme", type: "select", options: ["Sci-Fi / Space", "Animals & Nature", "Dinosaurs", "City & Architecture", "Classic Board Games", "No Theme"], required: false, defaultValue: "No Theme" }
  ],
  "Automotive": [
    { key: "vehicles", label: "Compatible Vehicle Models", type: "multiselect", options: ["Maruti Suzuki Swift", "Hyundai i20", "Honda City", "Mahindra XUV700", "Tata Nexon", "Universal Car Fitment"], required: true, defaultValue: [] },
    { key: "engines", label: "Engine Compatibility Specs", type: "text", required: false, defaultValue: "" },
    { key: "fuelType", label: "Compatible Fuel Source", type: "select", options: ["Petrol Engines", "Diesel Engines", "CNG Vehicles", "EV / Electric Vehicles", "All Fuel Types"], required: true, defaultValue: "All Fuel Types" },
    { key: "oemNumber", label: "OEM Manufacturer Part Number", type: "text", required: true, defaultValue: "" },
    { key: "material", label: "Heavy Duty Material", type: "select", options: ["High Grade Aluminum", "Hardened Stainless Steel", "Synthetic Rubber", "Carbon Fiber / Composite"], required: true, defaultValue: "High Grade Aluminum" },
    { key: "voltage", label: "Electrical Input Voltage", type: "select", options: ["12V DC Battery", "24V Heavy Duty Battery", "Not Applicable (Mechanical Part)"], required: false, defaultValue: "12V DC Battery" },
    { key: "warranty", label: "Automotive Warranty", type: "select", options: ["1 Year", "2 Years", "3 Years", "5 Years", "No Warranty"], required: true, defaultValue: "1 Year" },
    { key: "profInstall", label: "Professional Installation Advised", type: "checkbox", required: true, defaultValue: false }
  ],
  "Pet Supplies": [
    { key: "petType", label: "Pet Specie Target", type: "select", options: ["Dogs Only", "Cats Only", "Birds", "Aquarium Fishes", "Rabbits & Small Rodents"], required: true, defaultValue: "Dogs Only" },
    { key: "breedSize", label: "Breed Size Compatibility", type: "select", options: ["All Breed Sizes", "Toy & Small Breeds", "Medium Breed Dogs", "Large & Giant Breeds"], required: true, defaultValue: "All Breed Sizes" },
    { key: "flavor", label: "Flavor Profile", type: "select", options: ["Savory Chicken", "Fresh Salmon & Fish", "Real Beef & Meat", "Vegetable Feast", "No Flavor (Toy/Accessory)"], required: false, defaultValue: "No Flavor (Toy/Accessory)" },
    { key: "packSize", label: "Pet Pack Quantity Size", type: "select", options: ["500 g", "1.2 kg", "3 kg", "10 kg", "20 kg", "Single Toy", "Pack of 3"], required: true, defaultValue: "1.2 kg" },
    { key: "ingredients", label: "Feed Ingredients", type: "text", required: false, defaultValue: "" },
    { key: "ageGroup", label: "Pet Age Bracket", type: "select", options: ["Puppy / Kitten Stage", "Adult Pets (1-7 Years)", "Senior Pets (7+ Years)", "All Pet Ages"], required: true, defaultValue: "All Pet Ages" },
    { key: "nutrition", label: "Nutritional Analysis", type: "text", required: false, defaultValue: "" },
    { key: "material", label: "Chew Safe Material", type: "select", options: ["Chew-Proof Nylon", "Natural Durable Rubber", "Organic Cotton Rope", "BPA-Free Safe Food Plastic", "Not Applicable"], required: false, defaultValue: "Not Applicable" }
  ],
  "Gift Shop": [
    { key: "recipient", label: "Best Recipient", type: "select", options: ["For Father / Husband", "For Mother / Wife", "For Kids / Children", "For Friends & Coworkers", "Unisex / Universal Gifting"], required: true, defaultValue: "Unisex / Universal Gifting" },
    { key: "occasion", label: "Best Occasion", type: "select", options: ["Birthday Party", "Wedding Anniversary", "Diwali & Festivals", "Christmas Gifting", "House Warming Ceremony", "Congratulations Gift"], required: true, defaultValue: "Birthday Party" },
    { key: "custom", label: "Personalized Engraving / Custom Option", type: "checkbox", required: true, defaultValue: false },
    { key: "giftWrap", label: "Premium Gift Wrapping Available", type: "checkbox", required: true, defaultValue: true },
    { key: "isHandmade", label: "Handmade / Artisanal Product", type: "checkbox", required: true, defaultValue: false },
    { key: "material", label: "Primary Craft Material", type: "select", options: ["Artisanal Wooden", "Premium Glassware", "Polished Metal Alloy", "Terracotta Clay", "Mixed Handicraft Media"], required: false, defaultValue: "Artisanal Wooden" }
  ],
  "Seasonal Collections": [
    { key: "festival", label: "Associated Festival", type: "select", options: ["Diwali Special", "Christmas Holiday", "Eid Mubarak", "Holi Color Fest", "New Year Bash", "General Seasonal Selection"], required: false, defaultValue: "General Seasonal Selection" },
    { key: "season", label: "Associated Climate Season", type: "select", options: ["Summer Solstice", "Winter Wonderland", "Monsoon Rainwear", "Autumn Foliage Collection"], required: true, defaultValue: "Winter Wonderland" },
    { key: "year", label: "Collection Campaign Year", type: "number", required: true, defaultValue: 2026 },
    { key: "limited", label: "Limited Edition Stock", type: "checkbox", required: true, defaultValue: false },
    { key: "theme", label: "Aesthetic Design Theme", type: "select", options: ["Vintage & Retro Vibes", "Neon Glow Cyberpunk", "Minimalist Pastel Palette", "Floral Bloom Designs", "No Theme"], required: false, defaultValue: "No Theme" }
  ]
}

const seedAttributes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    for (const [categoryName, fields] of Object.entries(CATEGORY_SCHEMAS)) {
      const category = await Category.findOne({ name: categoryName })
      
      if (category) {
        await CategoryAttribute.findOneAndUpdate(
          { category: category._id },
          { 
            category: category._id,
            fields: fields
          },
          { upsert: true, new: true }
        )
        console.log(`Seeded attributes for ${categoryName}`)
      } else {
        console.log(`Warning: Category ${categoryName} not found in DB`)
      }
    }

    console.log('Attributes seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding attributes:', error)
    process.exit(1)
  }
}

seedAttributes()

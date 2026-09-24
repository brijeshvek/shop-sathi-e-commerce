import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.example' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://vekariyabrijesh2004_db_user:qLMtav3qgAhaKW8R@cluster0.mf1tfg4.mongodb.net/';
const IMAGES_DIR = 'C:\\Users\\Brijesh\\Downloads\\image';

async function processCategoryImages() {
  console.log('🚀 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI, { dbName: 'ecommerce' });
  console.log('✅ Connected to MongoDB!');

  const files = fs.readdirSync(IMAGES_DIR);
  console.log(`📁 Found ${files.length} files in ${IMAGES_DIR}`);

  const categoriesCollection = mongoose.connection.collection('categories');
  const allCategories = await categoriesCollection.find({}).toArray();

  for (const filename of files) {
    const filePath = path.join(IMAGES_DIR, filename);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const ext = path.extname(filename).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) continue;

    const baseName = path.basename(filename, ext).trim();
    console.log(`\n🖼️  Processing image: "${filename}" (Name: "${baseName}", Original size: ${(stat.size / 1024).toFixed(1)} KB)`);

    // Read and convert to WebP Base64
    const originalBuffer = fs.readFileSync(filePath);
    let webpBuffer;
    if (ext === '.webp') {
      // Re-compress/optimize
      webpBuffer = await sharp(originalBuffer).webp({ quality: 85, effort: 4 }).toBuffer();
    } else {
      webpBuffer = await sharp(originalBuffer).webp({ quality: 85, effort: 4 }).toBuffer();
    }

    const base64Url = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
    console.log(`✨ Converted to WebP: ${(webpBuffer.length / 1024).toFixed(1)} KB (Saved: ${(((stat.size - webpBuffer.length) / stat.size) * 100).toFixed(1)}%)`);

    // Find category match
    const cleanSearch = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let matchedCategory = allCategories.find(c => {
      const cClean = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const sClean = (c.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return cClean === cleanSearch || sClean === cleanSearch || cClean.includes(cleanSearch) || cleanSearch.includes(cClean);
    });

    // Special fallback for gift.webp
    if (!matchedCategory && (cleanSearch === 'gift' || cleanSearch === 'gifts' || cleanSearch === 'giftshop')) {
      matchedCategory = allCategories.find(c => c.slug === 'gift-shop' || c.name.toLowerCase().includes('gift'));
    }

    if (matchedCategory) {
      const publicId = `category_${matchedCategory.slug || matchedCategory._id}_${Date.now()}`;
      await categoriesCollection.updateOne(
        { _id: matchedCategory._id },
        { 
          $set: { 
            image: { 
              url: base64Url, 
              publicId: publicId 
            } 
          } 
        }
      );
      console.log(`✅ Updated Category: "${matchedCategory.name}" (ID: ${matchedCategory._id}, Slug: ${matchedCategory.slug})`);
    } else {
      console.warn(`⚠️  Could not find matching category for "${baseName}"`);
    }
  }

  console.log('\n🎉 All category images successfully converted to WebP Base64 and updated in MongoDB!');
  process.exit(0);
}

processCategoryImages().catch((err) => {
  console.error('❌ Error processing category images:', err);
  process.exit(1);
});

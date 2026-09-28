import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.example' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://vekariyabrijesh2004_db_user:qLMtav3qgAhaKW8R@cluster0.mf1tfg4.mongodb.net/ecommerce?retryWrites=true&w=majority';
const IMAGES_DIR = 'C:\\Users\\Brijesh\\Downloads\\image';

// Natural sort helper (handles 1, 2, 10 properly)
function naturalSort(files) {
  return files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
}

// Recursively find all product folders that contain images
function findProductFolders(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  
  const results = [];
  const subdirs = entries.filter(e => e.isDirectory());
  
  for (const s of subdirs) {
    if (s.name.endsWith('_files') || s.name.startsWith('.')) continue; // Skip web page saved resource folders
    
    const subDirPath = path.join(dir, s.name);
    const subEntries = fs.readdirSync(subDirPath, { withFileTypes: true });
    
    // Check if this subfolder contains images directly
    const imagesHere = subEntries.filter(e => {
      if (!e.isFile()) return false;
      const ext = path.extname(e.name).toLowerCase();
      return imageExts.includes(ext) && !e.name.startsWith('.');
    });
    
    // Check if this subfolder contains further subdirectories (like category -> product folders)
    const deeper = findProductFolders(subDirPath);
    
    if (imagesHere.length > 0) {
      results.push({
        folderPath: subDirPath,
        folderName: s.name,
        categoryName: path.basename(dir) === 'image' ? 'Root' : path.basename(dir),
        rawImages: imagesHere.map(i => i.name)
      });
    }
    
    for (const d of deeper) {
      if (!results.some(r => r.folderPath === d.folderPath)) {
        results.push(d);
      }
    }
  }
  
  return results;
}

async function ensureDBConnection() {
  if (mongoose.connection.readyState === 1) return;
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI, {
    dbName: 'ecommerce',
    serverSelectionTimeoutMS: 60000,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 120000,
    maxPoolSize: 10,
  });
  console.log('✅ Connected to MongoDB!');
}

async function uploadAllProductImages() {
  await ensureDBConnection();

  const productsCollection = mongoose.connection.collection('products');
  const allProducts = await productsCollection.find({}).toArray();
  console.log(`📦 Found ${allProducts.length} total products in database.\n`);

  const productFolders = findProductFolders(IMAGES_DIR);
  console.log(`📁 Found ${productFolders.length} product folders across categories in ${IMAGES_DIR}.\n`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (let pIdx = 0; pIdx < productFolders.length; pIdx++) {
    const pFolder = productFolders[pIdx];
    const { folderPath, folderName, categoryName, rawImages } = pFolder;

    if (rawImages.length === 0) {
      console.warn(`⚠️ No images found in: "${folderName}"`);
      skippedCount++;
      continue;
    }

    // Deduplicate images with same base name (e.g. "(1).jpg" vs "(1).webp" - keep larger size)
    const fileMap = new Map();
    for (const f of rawImages) {
      const parsed = path.parse(f);
      const filePath = path.join(folderPath, f);
      const stat = fs.statSync(filePath);
      
      const baseKey = parsed.name.trim();
      if (!fileMap.has(baseKey)) {
        fileMap.set(baseKey, { filename: f, size: stat.size });
      } else {
        const existing = fileMap.get(baseKey);
        if (stat.size > existing.size) {
          fileMap.set(baseKey, { filename: f, size: stat.size });
        }
      }
    }

    const uniqueFiles = Array.from(fileMap.values()).map(v => v.filename);
    const sortedFiles = naturalSort(uniqueFiles);

    // Clean folder name to match product
    const cleanFolder = folderName.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Match with database products
    let matchedProduct = allProducts.find(p => {
      const pClean = (p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const sClean = (p.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return pClean === cleanFolder || sClean === cleanFolder;
    });

    // Fallback: substring matching
    if (!matchedProduct) {
      matchedProduct = allProducts.find(p => {
        const pClean = (p.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const sClean = (p.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return pClean.includes(cleanFolder) || cleanFolder.includes(pClean) ||
               sClean.includes(cleanFolder) || cleanFolder.includes(sClean);
      });
    }

    if (!matchedProduct) {
      console.warn(`❌ [${pIdx + 1}/${productFolders.length}] No matching DB Product for: "${folderName}" (${categoryName})`);
      skippedCount++;
      continue;
    }

    console.log(`[${pIdx + 1}/${productFolders.length}] 📦 [${categoryName}] "${matchedProduct.name}" (${sortedFiles.length} images)`);

    const processedImages = [];

    for (let i = 0; i < sortedFiles.length; i++) {
      const filename = sortedFiles[i];
      const filePath = path.join(folderPath, filename);
      const originalBuffer = fs.readFileSync(filePath);

      try {
        const webpBuffer = await sharp(originalBuffer)
          .resize({ width: 750, height: 750, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 75, effort: 2 })
          .toBuffer();

        const base64Url = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
        const publicId = `product_${matchedProduct._id}_${i + 1}_${Date.now()}`;

        processedImages.push({
          url: base64Url,
          publicId: publicId,
          isMain: i === 0, // First image is main cover photo
        });
      } catch (imgErr) {
        console.error(`  ⚠️ Error on "${filename}":`, imgErr.message);
      }
    }

    if (processedImages.length > 0) {
      // Retry loop for MongoDB update in case of transient network glitches
      let retries = 3;
      let success = false;
      while (retries > 0 && !success) {
        try {
          await ensureDBConnection();
          await mongoose.connection.collection('products').updateOne(
            { _id: matchedProduct._id },
            {
              $set: {
                images: processedImages,
              },
            }
          );
          console.log(`  ✅ Saved ${processedImages.length} images for "${matchedProduct.name}"`);
          success = true;
          updatedCount++;
        } catch (dbErr) {
          retries--;
          console.warn(`  ⚠️ DB write retry (${retries} left) for "${matchedProduct.name}":`, dbErr.message);
          if (retries > 0) {
            try { await mongoose.disconnect(); } catch (_) {}
            await new Promise(r => setTimeout(r, 2000));
          } else {
            console.error(`  ❌ Failed to save "${matchedProduct.name}" after 3 retries.`);
          }
        }
      }
    }
  }

  console.log(`\n==================================================`);
  console.log(`🎉 SUMMARY:`);
  console.log(`  ✅ Successfully updated products: ${updatedCount}`);
  console.log(`  ⚠️ Skipped / Unmatched folders: ${skippedCount}`);
  console.log(`  📁 Total folders processed: ${productFolders.length}`);
  console.log(`==================================================\n`);

  process.exit(0);
}

uploadAllProductImages().catch(err => {
  console.error('❌ Fatal error during product image processing:', err);
  process.exit(1);
});

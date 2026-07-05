import 'dotenv/config';
import mongoose from 'mongoose';
import Category from './src/models/Category.model.js';
import Product from './src/models/Product.model.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional, but good for clean seeding)
    // await Category.deleteMany({});
    // await Product.deleteMany({});
    
    const categoriesData = [
      {
        name: 'Electronics',
        description: 'Latest gadgets and devices',
        image: { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60' }
      },
      {
        name: 'Fashion',
        description: 'Trendy clothing and accessories',
        image: { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60' }
      },
      {
        name: 'Home & Kitchen',
        description: 'Everything for your home',
        image: { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60' }
      },
      {
        name: 'Health & Beauty',
        description: 'Personal care and beauty products',
        image: { url: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=500&auto=format&fit=crop&q=60' }
      }
    ];

    console.log('Seeding categories...');
    const createdCategories = [];
    for (const cat of categoriesData) {
      let existingCat = await Category.findOne({ name: cat.name });
      if (!existingCat) {
        existingCat = await Category.create(cat);
      }
      createdCategories.push(existingCat);
    }

    console.log('Seeding products...');
    
    // Generate 10 products per category
    for (const category of createdCategories) {
      for (let i = 1; i <= 10; i++) {
        const productName = `${category.name} Product ${i}`;
        const existingProduct = await Product.findOne({ name: productName });
        
        if (!existingProduct) {
          const price = Math.floor(Math.random() * (900 - 10 + 1)) + 10; // 10 to 900
          const originalPrice = price + Math.floor(Math.random() * 100);
          
          await Product.create({
            name: productName,
            description: `This is a detailed description for ${productName}. It is a high-quality product in the ${category.name} category. Buy it today for the best experience.`,
            shortDescription: `Great ${category.name} item.`,
            price: price,
            originalPrice: originalPrice,
            category: category._id,
            brand: `Brand ${Math.floor(Math.random() * 5) + 1}`,
            stock: Math.floor(Math.random() * 50) + 10,
            images: [
              { url: category.image.url, isMain: true },
              { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60' }
            ],
            isActive: true,
            isFeatured: i <= 2 // Make first 2 of each category featured
          });
        }
      }
    }

    console.log('Database seeded successfully with categories and 10 products each!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

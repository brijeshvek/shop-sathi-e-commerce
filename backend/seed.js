import 'dotenv/config';
import mongoose from 'mongoose';
import Category from './src/models/Category.model.js';
import Product from './src/models/Product.model.js';
import User from './src/models/User.model.js';
import Order from './src/models/Order.model.js';
import Review from './src/models/Review.model.js';
import Coupon from './src/models/Coupon.model.js';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // 1. Seed Users (10 Customers, 10 Sellers)
    console.log('Seeding users...');
    const users = [];
    const password = await bcrypt.hash('password123', 12);
    
    for(let i=1; i<=10; i++) {
       let customer = await User.findOne({ email: `customer${i}@example.com` });
       if (!customer) {
         customer = await User.create({
           name: `Customer ${i}`, email: `customer${i}@example.com`, password, role: 'customer', phone: `98765432${String(i).padStart(2, '0')}`
         });
       }
       users.push(customer);

       let seller = await User.findOne({ email: `seller${i}@example.com` });
       if (!seller) {
         seller = await User.create({
           name: `Seller ${i}`, email: `seller${i}@example.com`, password, role: 'seller', phone: `98765442${String(i).padStart(2, '0')}`,
           sellerInfo: { storeName: `Store ${i}`, description: `This is store ${i}` }
         });
       }
       users.push(seller);
    }
    const customers = users.filter(u => u.role === 'customer');

    // 2. Seed Categories
    console.log('Seeding categories...');
    const categoriesData = [
      { name: 'Electronics', description: 'Gadgets' },
      { name: 'Fashion', description: 'Clothing' },
      { name: 'Home & Kitchen', description: 'Home decor' },
      { name: 'Health & Beauty', description: 'Care' },
      { name: 'Sports', description: 'Sports gear' },
      { name: 'Automotive', description: 'Car accessories' },
      { name: 'Books', description: 'Literature' },
      { name: 'Toys', description: 'Kids' },
      { name: 'Groceries', description: 'Food' },
      { name: 'Pets', description: 'Pet care' },
    ];
    const categories = [];
    for (const cat of categoriesData) {
      let existingCat = await Category.findOne({ name: cat.name });
      if (!existingCat) {
        existingCat = await Category.create({ ...cat, image: { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500' } });
      }
      categories.push(existingCat);
    }

    // 3. Seed Products (10 per category)
    console.log('Seeding products...');
    const products = [];
    for (const category of categories) {
      for (let i = 1; i <= 10; i++) {
        const name = `${category.name} Product ${i}`;
        let product = await Product.findOne({ name });
        if (!product) {
          product = await Product.create({
            name, description: `Description for ${name}`, shortDescription: `Short for ${name}`,
            price: Math.floor(Math.random() * 900) + 10,
            originalPrice: Math.floor(Math.random() * 1000) + 100,
            category: category._id, stock: Math.floor(Math.random() * 50),
            images: [
              { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80', isMain: true },
              { url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80', isMain: false },
              { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', isMain: false },
              { url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80', isMain: false }
            ],
            isActive: true
          });
        }
        products.push(product);
      }
    }

    // 4. Seed Orders (Random status)
    console.log('Seeding orders...');
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    for(let i=0; i<10; i++) {
      const customer = customers[i % customers.length];
      const product = products[Math.floor(Math.random() * products.length)];
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      const orderNumber = `ORD-TEST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      await Order.create({
        orderNumber,
        user: customer._id,
        items: [{ product: product._id, name: product.name, price: product.price, quantity: 1 }],
        shippingAddress: { fullName: customer.name, phone: '123', street: '123 Main', city: 'City', state: 'State', pincode: '12345' },
        paymentMethod: 'COD',
        orderStatus: statuses[Math.floor(Math.random() * statuses.length)],
        subtotal: product.price, totalAmount: product.price,
        createdAt: date
      });
    }

    // 5. Seed Reviews
    console.log('Seeding reviews...');
    for(let i=0; i<10; i++) {
      const customer = customers[i % customers.length];
      const product = products[i];
      let review = await Review.findOne({ product: product._id, user: customer._id });
      if(!review) {
        await Review.create({
          product: product._id, user: customer._id, rating: 4, comment: 'Great product, really liked it! I highly recommend it to everyone.'
        });
      }
    }

    // 6. Seed Coupons
    console.log('Seeding coupons...');
    for(let i=1; i<=10; i++) {
      const code = `DISCOUNT${i}0`;
      let coupon = await Coupon.findOne({ code });
      if(!coupon) {
        await Coupon.create({
          code, discountType: 'percentage', discountValue: i*10, expiresAt: new Date(Date.now() + 30*24*60*60*1000)
        });
      }
    }

    console.log('Database seeded successfully with 10 real records each!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

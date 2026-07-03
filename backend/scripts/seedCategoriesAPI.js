const categoriesData = [
  { name: 'New Arrivals', description: 'Recently launched products and the latest additions to the store.' },
  { name: 'Trending Products', description: 'Popular products that are currently in high demand.' },
  { name: 'Best Sellers', description: 'Top-selling products based on customer purchases.' },
  { name: 'Deals & Offers', description: 'Discounted products, seasonal promotions, and limited-time offers.' },
  { name: 'Flash Sale', description: 'Time-limited promotional products with special pricing.' },
  {
    name: 'Electronics',
    children: [
      { name: 'Smartphones', description: 'Android and iPhone devices from various brands.' },
      { name: 'Tablets', description: 'Android, iPad, and Windows tablets.' },
      { name: 'Laptops', description: 'Gaming, business, student, and ultrabook laptops.' },
      { name: 'Desktop Computers', description: 'Personal computers and all-in-one desktops.' },
      { name: 'Computer Components', description: 'CPUs, GPUs, RAM, SSDs, motherboards, and power supplies.' },
      { name: 'Monitors', description: 'Gaming, office, and professional displays.' },
      { name: 'Printers & Scanners', description: 'Home and office printing solutions.' },
      { name: 'Networking', description: 'Wi-Fi routers, switches, extenders, and modems.' },
      { name: 'Storage Devices', description: 'External drives, SSDs, HDDs, USB drives, and memory cards.' },
      { name: 'Smart Home', description: 'Smart lights, cameras, locks, plugs, and assistants.' }
    ]
  },
  {
    name: 'Mobile Accessories',
    children: [
      { name: 'Phone Cases', description: 'Protective covers for smartphones.' },
      { name: 'Screen Protectors', description: 'Tempered glass and film protectors.' },
      { name: 'Chargers', description: 'Wall chargers, wireless chargers, and car chargers.' },
      { name: 'Power Banks', description: 'Portable battery charging solutions.' },
      { name: 'Cables', description: 'USB-C, Lightning, Micro-USB, and HDMI cables.' },
      { name: 'Earbuds & Headphones', description: 'Wireless and wired audio devices.' },
      { name: 'Smartwatches', description: 'Fitness and lifestyle smartwatches.' },
      { name: 'Phone Holders', description: 'Vehicle mounts and desktop stands.' }
    ]
  },
  {
    name: 'Fashion',
    children: [
      {
        name: 'Men',
        children: [
          { name: 'T-Shirts' }, { name: 'Shirts' }, { name: 'Jeans' }, { name: 'Trousers' }, { name: 'Shorts' },
          { name: 'Jackets' }, { name: 'Hoodies' }, { name: 'Suits' }, { name: 'Ethnic Wear' }, { name: 'Men Footwear' },
          { name: 'Watches' }, { name: 'Wallets' }, { name: 'Belts' }
        ]
      },
      {
        name: 'Women',
        children: [
          { name: 'Dresses' }, { name: 'Tops' }, { name: 'Kurtis' }, { name: 'Sarees' }, { name: 'Women Jeans' },
          { name: 'Leggings' }, { name: 'Skirts' }, { name: 'Handbags' }, { name: 'Jewelry' }, { name: 'Women Footwear' },
          { name: 'Women Watches' }
        ]
      },
      {
        name: 'Kids',
        children: [
          { name: 'Boys Clothing' }, { name: 'Girls Clothing' }, { name: 'Baby Clothing' }, { name: 'School Uniforms' },
          { name: 'Baby Accessories' }
        ]
      }
    ]
  },
  {
    name: 'Beauty & Personal Care',
    children: [
      { name: 'Skincare' }, { name: 'Hair Care' }, { name: 'Makeup' }, { name: 'Fragrances' },
      { name: 'Mens Grooming' }, { name: 'Bath & Body' }, { name: 'Personal Hygiene' }, { name: 'Beauty Tools' }
    ]
  },
  {
    name: 'Home & Kitchen',
    children: [
      { name: 'Furniture' }, { name: 'Kitchen Appliances' }, { name: 'Cookware' }, { name: 'Dinnerware' },
      { name: 'Storage Solutions' }, { name: 'Home Decor' }, { name: 'Lighting' }, { name: 'Curtains' },
      { name: 'Bedding' }, { name: 'Cleaning Supplies' }
    ]
  },
  {
    name: 'Grocery & Essentials',
    children: [
      { name: 'Fruits & Vegetables' }, { name: 'Dairy Products' }, { name: 'Snacks' }, { name: 'Beverages' },
      { name: 'Rice & Grains' }, { name: 'Spices' }, { name: 'Oils' }, { name: 'Bakery' }, { name: 'Frozen Foods' },
      { name: 'Organic Foods' }
    ]
  },
  {
    name: 'Health & Wellness',
    children: [
      { name: 'Vitamins & Supplements' }, { name: 'Medical Equipment' }, { name: 'Personal Care' }, 
      { name: 'Fitness Nutrition' }, { name: 'First Aid Supplies' }, { name: 'Wellness Products' }
    ]
  },
  {
    name: 'Sports & Fitness',
    children: [
      { name: 'Gym Equipment' }, { name: 'Yoga Equipment' }, { name: 'Cricket' }, { name: 'Football' },
      { name: 'Basketball' }, { name: 'Badminton' }, { name: 'Cycling' }, { name: 'Running' },
      { name: 'Outdoor Sports' }, { name: 'Fitness Accessories' }
    ]
  },
  {
    name: 'Books & Stationery',
    children: [
      { name: 'Fiction' }, { name: 'Non-Fiction' }, { name: 'Academic Books' }, { name: 'Childrens Books' },
      { name: 'Notebooks' }, { name: 'Office Supplies' }, { name: 'Art Supplies' }, { name: 'School Essentials' }
    ]
  },
  {
    name: 'Toys & Games',
    children: [
      { name: 'Educational Toys' }, { name: 'Action Figures' }, { name: 'Board Games' }, { name: 'Puzzles' },
      { name: 'Outdoor Toys' }, { name: 'RC Toys' }, { name: 'Dolls' }, { name: 'Building Blocks' }
    ]
  },
  {
    name: 'Automotive',
    children: [
      { name: 'Car Accessories' }, { name: 'Bike Accessories' }, { name: 'Helmets' }, { name: 'Car Care' },
      { name: 'Engine Oil' }, { name: 'Tires' }, { name: 'Vehicle Electronics' }
    ]
  },
  {
    name: 'Pet Supplies',
    children: [
      { name: 'Dog Food' }, { name: 'Cat Food' }, { name: 'Bird Supplies' }, { name: 'Fish Supplies' },
      { name: 'Pet Grooming' }, { name: 'Pet Toys' }, { name: 'Pet Beds' }
    ]
  },
  {
    name: 'Office Equipment', 
    children: [
      { name: 'Office Furniture' }, { name: 'Office Electronics' }, { name: 'Printers' }, { name: 'Paper Products' },
      { name: 'Writing Instruments' }, { name: 'Office Organization' }
    ]
  },
  {
    name: 'Garden & Outdoor',
    children: [
      { name: 'Plants' }, { name: 'Gardening Tools' }, { name: 'Outdoor Furniture' }, { name: 'BBQ Equipment' },
      { name: 'Outdoor Lighting' }, { name: 'Garden Decor' }
    ]
  },
  {
    name: 'Jewelry & Accessories',
    children: [
      { name: 'Rings' }, { name: 'Necklaces' }, { name: 'Earrings' }, { name: 'Bracelets' }, { name: 'Jewelry Watches' },
      { name: 'Sunglasses' }, { name: 'Fashion Accessories' }
    ]
  },
  {
    name: 'Baby Products',
    children: [
      { name: 'Baby Clothing' }, { name: 'Diapers' }, { name: 'Feeding Essentials' }, { name: 'Baby Toys' },
      { name: 'Baby Care' }, { name: 'Baby Furniture' }, { name: 'Strollers' }
    ]
  },
  {
    name: 'Digital Products',
    children: [
      { name: 'Software' }, { name: 'E-books' }, { name: 'Online Courses' }, { name: 'Digital Gift Cards' },
      { name: 'Digital Downloads' }
    ]
  },
  {
    name: 'Gift Shop',
    children: [
      { name: 'Birthday Gifts' }, { name: 'Anniversary Gifts' }, { name: 'Wedding Gifts' }, { name: 'Festival Gifts' },
      { name: 'Corporate Gifts' }, { name: 'Personalized Gifts' }
    ]
  },
  {
    name: 'Seasonal Collections',
    children: [
      { name: 'Summer Collection' }, { name: 'Winter Collection' }, { name: 'Festival Specials' }, 
      { name: 'Holiday Offers' }, { name: 'Back-to-School' }, { name: 'Wedding Collection' }
    ]
  }
]

async function seedViaAPI() {
  try {
    const res = await fetch('http://localhost:5005/api/seed-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoriesData })
    });
    const data = await res.json();
    console.log('Seed response:', data);
  } catch(err) {
    console.error('Fetch error:', err);
  }
}
seedViaAPI();

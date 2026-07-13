import mongoose from 'mongoose'
import dotenv from 'dotenv'
import BlogPost from '../models/BlogPost.model.js'
import FAQ from '../models/FAQ.model.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') })

const blogsData = [
  {
    title: "The Ultimate Guide to Shopping Online Safely",
    summary: "Discover essential tips and best practices to protect your personal information and make secure online purchases.",
    content: "Shopping online offers unmatched convenience, but it also comes with risks. To shop safely, always verify that the website has a secure connection (look for the HTTPS padlock icon). Avoid using public Wi-Fi networks when entering payment details, and regularly monitor your bank statements for unauthorized charges. Using credit cards or secure payment getways like PayPal adds an extra layer of protection.",
    author: "ShopSathi Team",
    tags: ["Shopping", "Security", "Tips"],
    image: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=800&auto=format&fit=crop"
  },
  {
    title: "Top 10 Fashion Trends to Watch This Season",
    summary: "From retro aesthetics to sustainable fabrics, explore the biggest trends hitting the fashion world right now.",
    content: "This season is all about self-expression and comfort. We are seeing a major resurgence of 90s streetwear, oversized tailoring, and earth-toned color palettes. More importantly, sustainable fashion is no longer a niche market—organic cotton, recycled polyester, and vegan leather are dominating the runways and retail shops alike.",
    author: "Fashion Critic",
    tags: ["Fashion", "Trends", "Style"],
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop"
  },
  {
    title: "How to Choose the Best Electronics for Your Home",
    summary: "Need a new smart TV or sound system? Read our expert buying guide to find the perfect electronics for your space.",
    content: "Buying home electronics can be overwhelming due to the sheer number of specifications. When looking for a new TV, prioritize display technology (like OLED or QLED) and resolution (4K is now standard). For audio systems, consider wireless connectivity options and smart assistant compatibility to future-proof your living room setup.",
    author: "Tech Guru",
    tags: ["Electronics", "Tech", "Buying Guide"],
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop"
  },
  {
    title: "The Benefits of Organic and Sustainable Products",
    summary: "Learn why choosing organic groceries and sustainable goods is better for your health and the environment.",
    content: "Organic farming avoids chemical pesticides and fertilizers, resulting in food that is cleaner and often richer in nutrients. Similarly, sustainable household products minimize carbon footprints and decrease landfill waste. Making the switch to eco-friendly options is a powerful step towards building a healthier planet.",
    author: "Eco Advocate",
    tags: ["Organic", "Sustainability", "Health"],
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop"
  },
  {
    title: "5 Easy Ways to Organize Your Kitchen Today",
    summary: "De-clutter your countertops and maximize storage space with these simple, cost-effective kitchen organization ideas.",
    content: "An organized kitchen makes cooking a breeze. Start by grouping similar items together (e.g., all baking supplies in one bin). Maximize vertical space by adding stackable shelves inside cabinets, and use clear glass jars to store dry goods. This not only keeps items fresh but also lets you see exactly what ingredients you have left.",
    author: "Home Organizer",
    tags: ["Home & Kitchen", "Organization", "DIY"],
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop"
  },
  {
    title: "A Beginner's Guide to Smart Home Gadgets",
    summary: "From smart plugs to voice assistants, learn how to start building your own automated smart home system.",
    content: "You don't need a huge budget to make your home smart. Start small with a voice assistant speaker and a few smart plugs, which allow you to control lamps and appliances remotely. From there, you can expand to smart light bulbs and security cameras to add convenience, energy efficiency, and safety to your daily routine.",
    author: "Tech Insider",
    tags: ["Smart Home", "Tech", "Automation"],
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop"
  },
  {
    title: "Why Customer Reviews are Crucial for E-Commerce",
    summary: "Understand the power of social proof and how customer feedback shapes today's online shopping decisions.",
    content: "Customer reviews provide transparency and build trust. Shoppers rely heavily on the experiences of previous buyers to gauge product quality and sizing accuracy. By leaving detailed reviews, customers help online stores improve their products and assist fellow shoppers in making informed purchase decisions.",
    author: "Retail Expert",
    tags: ["Reviews", "E-Commerce", "Customer Feedback"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop"
  },
  {
    title: "How to Care for Your Winter Apparel",
    summary: "Keep your heavy jackets, wool sweaters, and boots looking brand new with our fabric care tips.",
    content: "Winter garments require special care to maintain their texture and warmth. Always read the care labels—many wool and cashmere sweaters should be hand-washed or dry-cleaned rather than tossed in the machine. Store jackets on sturdy hangers to preserve their shape, and waterproof leather boots before heading out in snow or rain.",
    author: "Apparel Stylist",
    tags: ["Apparel", "Maintenance", "Winter Care"],
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop"
  },
  {
    title: "Healthy Eating: Tips for Buying Groceries Online",
    summary: "Master the art of virtual grocery shopping and fill your digital cart with nutritious, wholesome foods.",
    content: "Online grocery shopping is a great way to avoid impulse buys. To keep it healthy, plan your meals before starting your order and stick strictly to your list. Buy fresh produce in season for the best flavor, and check ingredient lists on packaged goods to avoid hidden sugars and excess sodium.",
    author: "Nutritionist",
    tags: ["Groceries", "Health", "Tips"],
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop"
  },
  {
    title: "The Importance of Quality Sleep: Bedding & Mattress Guide",
    summary: "Explore how thread count, mattress firmness, and pillow types can improve your overall sleep quality.",
    content: "Quality sleep is the foundation of physical and mental health. The right bedding plays a massive role in temperature regulation and comfort. Choose breathable, 100% cotton sheets for hot summer nights, and invest in a mattress that offers proper spinal support. Your body will thank you every morning.",
    author: "Sleep Scientist",
    tags: ["Sleep", "Bedding", "Comfort"],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop"
  }
]

const faqsData = [
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive a tracking link via email and SMS. You can also view the status of your order anytime under the 'My Orders' section on your account page.",
    category: "Shipping & Delivery",
    order: 1
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), and Cash on Delivery (COD).",
    category: "Payments",
    order: 2
  },
  {
    question: "Can I return a product if I am not satisfied?",
    answer: "Yes, you can request a return within 7 days of delivery for eligible items. The product must be unused, in its original packaging, and with all tags intact. Go to your orders history to initiate a return request.",
    category: "Returns & Refunds",
    order: 3
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping typically takes 3 to 7 business days depending on your location. Metro cities usually receive orders within 3 days, whereas remote areas might take up to 7 days.",
    category: "Shipping & Delivery",
    order: 4
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we only ship orders within India. We plan to expand to international shipping in the near future.",
    category: "Shipping & Delivery",
    order: 5
  },
  {
    question: "How can I apply a discount coupon?",
    answer: "You can apply a coupon code at the checkout screen. Enter your code in the promo box and click 'Apply' before submitting the order to see the discount deducted from your total amount.",
    category: "Promotions & Offers",
    order: 6
  },
  {
    question: "What should I do if my payment fails?",
    answer: "If your payment fails but the money is debited from your account, it is usually refunded automatically within 3-5 business days. You can try placing the order again or contact our support team for assistance.",
    category: "Payments",
    order: 7
  },
  {
    question: "Are my card details secure?",
    answer: "Absolutely. We do not store your complete card details. All transactions are securely processed through industry-standard encrypted payment gateways.",
    category: "Payments",
    order: 8
  },
  {
    question: "Can I exchange an item instead of returning it?",
    answer: "Yes! If the product has exchange options (e.g. clothing size issues), you can request an exchange under the 'My Orders' tab by selecting the preferred new variant.",
    category: "Returns & Refunds",
    order: 9
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact our customer support team via email at support@shopsathi.com or call us at our helpline number listed on the Contact Us page. We are active from 9:00 AM to 6:00 PM, Monday through Saturday.",
    category: "Customer Service",
    order: 10
  }
]

const seedCms = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shop-sathi-e-commerce'
    console.log(`Connecting to database at ${mongoUri}...`)
    await mongoose.connect(mongoUri)
    console.log('Connected!')

    console.log('Clearing old blog posts...')
    await BlogPost.deleteMany({})

    console.log('Seeding blog posts...')
    await BlogPost.create(blogsData)
    console.log('Blogs seeded successfully!')

    console.log('Clearing old FAQs...')
    await FAQ.deleteMany({})

    console.log('Seeding FAQs...')
    await FAQ.create(faqsData)
    console.log('FAQs seeded successfully!')

    console.log('CMS Seeding Completed!')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seedCms()

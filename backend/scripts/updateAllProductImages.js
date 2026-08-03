import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/Product.model.js';
import Category from '../src/models/Category.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://vekariyabrijesh2004_db_user:qLMtav3qgAhaKW8R@cluster0.mf1tfg4.mongodb.net/ShopEase?retryWrites=true&w=majority';

// Specific high quality image pools matching product names
const EXACT_PRODUCT_IMAGES = {
  "OnePlus 12 5G (Flowy Emerald)": [
    { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "iPad Air 11-inch (M2 Chip)": [
    { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "MacBook Air 13-inch M3": [
    { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Spigen Liquid Air Case for iPhone 15 Pro": [
    { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1541877944-ac82a091518a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Anker 737 Power Bank (PowerCore 24K)": [
    { url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Casual Slim Fit Linen Shirt": [
    { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Floral A-Line Summer Dress": [
    { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Minimalist Leather Watch": [
    { url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Hydrating Hyaluronic Acid Serum": [
    { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Prestige Induction Cooktop (2000W)": [
    { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Samsung Galaxy S24 Ultra 5G": [
    { url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Asus ROG Strix G16 (2024)": [
    { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Apple Mac mini M2 Pro": [
    { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "AMD Ryzen 9 7950X Desktop Processor": [
    { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "LG 27-inch 4K UHD IPS Monitor": [
    { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "HP LaserJet Pro MFP 4101fdw": [
    { url: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "TP-Link Archer AX73 Wi-Fi 6 Router": [
    { url: "https://images.unsplash.com/photo-1544122860-15632120db37?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Samsung 990 PRO 2TB NVMe M.2 SSD": [
    { url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Amazon Echo Dot (5th Gen, 2022)": [
    { url: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Microsoft Surface Pro 9": [
    { url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "OtterBox Defender Series Case for Galaxy S24 Ultra": [
    { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1541877944-ac82a091518a?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Spigen Glas.tR EZ Fit Tempered Glass for iPhone 15 Pro": [
    { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Apple 20W USB-C Power Adapter": [
    { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Anker 313 Wireless Charger (Pad)": [
    { url: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1622445268465-8431b68a4202?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Samsung 10000mAh Super Fast Charge Power Bank": [
    { url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Belkin BoostCharge Pro Flex USB-C to Lightning Cable": [
    { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Sony WF-1000XM5 True Wireless Earbuds": [
    { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1606220588913-b3eea8951234?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Apple AirPods Pro (2nd Generation)": [
    { url: "https://images.unsplash.com/photo-1606220588913-b3eea8951234?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Apple Watch Series 9 (GPS, 45mm)": [
    { url: "https://images.unsplash.com/photo-1434493789847-2f02b0c156f4?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "iOttie Easy One Touch 5 Car Mount": [
    { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1541877944-ac82a091518a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  "Mobil 1 Extended Performance Full Synthetic Motor Oil 5W-30": [
    { url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", isMain: false }
  ]
};

// Fallback high quality multi-image pool for any other products by category/keyword
const FALLBACK_CATEGORY_POOLS = {
  electronics: [
    { url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  fashion: [
    { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  beauty: [
    { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  home: [
    { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=800&q=80", isMain: false }
  ],
  default: [
    { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80", isMain: false }
  ]
};

async function updateAllProductImages() {
  try {
    console.log("Connecting to MongoDB database...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    const products = await Product.find({}).populate('category');
    console.log(`Found total ${products.length} products in database.`);

    let updatedCount = 0;

    for (const product of products) {
      let targetImages = EXACT_PRODUCT_IMAGES[product.name];

      if (!targetImages) {
        // Find pool by product name or category
        const lowerName = product.name.toLowerCase();
        const catName = product.category?.name?.toLowerCase() || '';

        if (lowerName.includes('shirt') || lowerName.includes('dress') || catName.includes('fashion')) {
          targetImages = FALLBACK_CATEGORY_POOLS.fashion;
        } else if (lowerName.includes('serum') || lowerName.includes('cream') || catName.includes('beauty')) {
          targetImages = FALLBACK_CATEGORY_POOLS.beauty;
        } else if (lowerName.includes('cooktop') || lowerName.includes('kitchen') || catName.includes('home')) {
          targetImages = FALLBACK_CATEGORY_POOLS.home;
        } else if (catName.includes('electronics') || lowerName.includes('phone') || lowerName.includes('laptop')) {
          targetImages = FALLBACK_CATEGORY_POOLS.electronics;
        } else {
          targetImages = FALLBACK_CATEGORY_POOLS.default;
        }
      }

      // Update product with 4 images
      product.images = targetImages;
      await product.save();
      updatedCount++;
      console.log(`[${updatedCount}/${products.length}] Updated 4 images for: "${product.name}"`);
    }

    console.log(`\n🎉 Success! All ${updatedCount} products updated with 3-4 high quality images.`);
  } catch (error) {
    console.error("Error updating product images:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateAllProductImages();

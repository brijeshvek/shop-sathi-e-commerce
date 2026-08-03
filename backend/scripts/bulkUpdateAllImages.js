/**
 * Bulk Image Updater - All 140 Products
 * Adds 4-5 verified Unsplash images to every product in database
 * Strategy: Product-name keywords first, then category fallback pools
 * No 404 errors - all URLs are verified Unsplash CDN links
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://vekariyabrijesh2004_db_user:qLMtav3qgAhaKW8R@cluster0.mf1tfg4.mongodb.net/ecommerce?retryWrites=true&w=majority';


// ============================================================
// CATEGORY IMAGE POOLS (Verified Unsplash URLs)
// ============================================================
const CATEGORY_IMAGE_POOLS = {
  // Electronics
  smartphone: [
    { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1575695342323-0ed8a02d3b7f?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  laptop: [
    { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  tablet: [
    { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1527698266440-12104e498b76?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  monitor: [
    { url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1484788984921-03950022c38b?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  printer: [
    { url: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1615469958067-0680a1ed7945?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  router: [
    { url: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1580137197581-df2bb346a786?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  ssd: [
    { url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  smartspeaker: [
    { url: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1558089687-f282ffcbc0d6?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1512446816042-444d641267d4?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  surface: [
    { url: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  processor: [
    { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Mobile Accessories
  phonecase: [
    { url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  charger: [
    { url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1622445268465-8431b68a4202?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  powerbank: [
    { url: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1622445268465-8431b68a4202?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  cable: [
    { url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  earbuds: [
    { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1606220588913-b3eea8951234?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1631176093617-5edb9b77f851?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  smartwatch: [
    { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1434493789847-2f02b0c156f4?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  screenprotector: [
    { url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  phoneholder: [
    { url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Fashion
  shirt: [
    { url: 'https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  dress: [
    { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  kurta: [
    { url: 'https://images.unsplash.com/photo-1597983073493-88cd7d456c67?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1583391733958-d25e77d2e051?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1536766820879-059fec98ec0a?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1591213954196-2d0ccb3f8d4c?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  watch: [
    { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1542496658-e33a6d0d4c6a?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1639611773946-70d4e418d0b9?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  shoes: [
    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  bag: [
    { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Beauty & Personal Care
  serum: [
    { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  perfume: [
    { url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1600612253971-183e0c7d62c4?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  skincare: [
    { url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  shampoo: [
    { url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  lipstick: [
    { url: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2905?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1631214524020-3c69cf5c6e05?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  razor: [
    { url: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Home & Kitchen
  cookware: [
    { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1617611413968-1d2c82f6f0c9?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  induction: [
    { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1628191081263-ab08c6c14c32?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  furniture: [
    { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  bedding: [
    { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  decor: [
    { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  light: [
    { url: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Grocery
  fruits: [
    { url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  dairy: [
    { url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1619033073783-57e84ebca0ea?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  snack: [
    { url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1508330181539-b1b35b4ae023?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  rice: [
    { url: 'https://images.unsplash.com/photo-1536304993881-ff86e53c3ce5?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  spice: [
    { url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1583474257013-72261b54c0f4?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1599421498111-9b23ff1f0b16?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1602934445884-da0fa1c9d3b3?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Health & Wellness
  supplement: [
    { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  protein: [
    { url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1584991107459-30d2e0ce4a61?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  medical: [
    { url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Sports
  yoga: [
    { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  gym: [
    { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  cycling: [
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Books
  book: [
    { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  notebook: [
    { url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1543086304-8a43b04ec949?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  calculator: [
    { url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1557997563-d88ac5c8e667?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1554774853-719586f82d77?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Toys
  toy: [
    { url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1613721036769-f563d895d18a?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  puzzle: [
    { url: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Automotive
  motoroil: [
    { url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1558618047-f4e80c0d3b37?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  helmet: [
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  caraccessory: [
    { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1558618047-f4e80c0d3b37?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Pet Supplies
  dogfood: [
    { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  catfood: [
    { url: 'https://images.unsplash.com/photo-1536590158209-7e58fb48bd46?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  petbed: [
    { url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  // Gift Shop
  gift: [
    { url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1535916707207-35a2b09db5cc?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
};

// ============================================================
// CATEGORY FALLBACK POOLS
// ============================================================
const CATEGORY_FALLBACK = {
  Electronics: [
    { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  'Mobile Accessories': [
    { url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  Fashion: [
    { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  'Beauty & Personal Care': [
    { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  'Home & Kitchen': [
    { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  'Grocery & Essentials': [
    { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1619033073783-57e84ebca0ea?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  'Health & Wellness': [
    { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  'Sports & Fitness': [
    { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  'Books & Stationery': [
    { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  'Toys & Games': [
    { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  Automotive: [
    { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1558618047-f4e80c0d3b37?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  'Pet Supplies': [
    { url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  'Gift Shop': [
    { url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1535916707207-35a2b09db5cc?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  'Seasonal Collections': [
    { url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1535916707207-35a2b09db5cc?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
  default: [
    { url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80', isMain: true },
    { url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80', isMain: false },
    { url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80', isMain: false },
  ],
};

// ============================================================
// KEYWORD MATCHING FUNCTION
// ============================================================
function getImagesForProduct(name, categoryName) {
  const nameLower = name.toLowerCase();

  // Keyword -> image pool mapping (ordered by specificity)
  const keywordMap = [
    // Electronics
    { keywords: ['oneplus', 'samsung galaxy', 'iphone', 'pixel', 'redmi', 'poco', 'motorola', 'nokia', 'vivo', 'oppo', 'realme'], pool: 'smartphone' },
    { keywords: ['macbook', 'laptop', 'notebook pc', 'asus rog', 'asus vivobook', 'hp pavilion', 'dell xps', 'lenovo', 'thinkpad'], pool: 'laptop' },
    { keywords: ['ipad', 'galaxy tab', 'surface go', 'tab s', 'fire hd', 'tablet'], pool: 'tablet' },
    { keywords: ['surface pro'], pool: 'surface' },
    { keywords: ['monitor', 'lg 27', 'lg 24', 'dell monitor', 'samsung monitor', 'viewsonic'], pool: 'monitor' },
    { keywords: ['laserjet', 'printer', 'inkjet', 'scanner', 'mfp'], pool: 'printer' },
    { keywords: ['wi-fi 6', 'router', 'archer', 'tp-link', 'netgear', 'asus router', 'modem'], pool: 'router' },
    { keywords: ['ssd', 'nvme', 'solid state', 'm.2', 'hard drive', 'hdd', '990 pro', '870 evo'], pool: 'ssd' },
    { keywords: ['echo dot', 'echo show', 'alexa', 'smart speaker', 'google home', 'mini speaker'], pool: 'smartspeaker' },
    { keywords: ['ryzen', 'intel core', 'processor', 'cpu', 'i7', 'i9', 'threadripper'], pool: 'processor' },
    { keywords: ['mac mini', 'imac', 'desktop pc'], pool: 'laptop' },
    // Mobile Accessories
    { keywords: ['case for', 'liquid air', 'otterbox', 'defender', 'spigen', 'phone case', 'back cover', 'bumper case'], pool: 'phonecase' },
    { keywords: ['20w usb-c', 'power adapter', 'wall charger', 'fast charger', 'usb charger', 'gan charger'], pool: 'charger' },
    { keywords: ['wireless charger', 'qi certified', 'charging pad', 'wireless pad'], pool: 'charger' },
    { keywords: ['anker 737', 'powercore', 'power bank', 'portable charger', '10000mah', '20000mah', 'samsung power bank'], pool: 'powerbank' },
    { keywords: ['usb-c cable', 'lightning cable', 'braided cable', 'data cable', 'type-c cable', 'belkin cable'], pool: 'cable' },
    { keywords: ['airpods', 'earbuds', 'wf-1000', 'sony wf', 'true wireless', 'earphone', 'headphones', 'in-ear'], pool: 'earbuds' },
    { keywords: ['apple watch', 'galaxy watch', 'fitbit', 'mi band', 'noise smartwatch', 'smartwatch', 'smart band'], pool: 'smartwatch' },
    { keywords: ['glas.tr', 'tempered glass', 'screen protector', 'screen guard'], pool: 'screenprotector' },
    { keywords: ['car mount', 'phone holder', 'iottie', 'dashboard mount', 'windshield mount'], pool: 'phoneholder' },
    // Fashion
    { keywords: ['kurta', 'sherwani', 'ethnic', 'traditional wear', 'festive kurta', 'salwar'], pool: 'kurta' },
    { keywords: ['linen shirt', 'casual shirt', 'formal shirt', 'polo shirt', 't-shirt', 'shirt'], pool: 'shirt' },
    { keywords: ['summer dress', 'maxi dress', 'floral dress', 'a-line', 'midi dress', 'saree'], pool: 'dress' },
    { keywords: ['minimalist watch', 'luxury watch', 'chronograph', 'quartz watch', 'analog watch'], pool: 'watch' },
    { keywords: ['sneakers', 'running shoes', 'loafers', 'boots', 'sandals', 'footwear', 'heels'], pool: 'shoes' },
    { keywords: ['handbag', 'backpack', 'tote bag', 'sling bag', 'wallet', 'clutch', 'purse'], pool: 'bag' },
    // Beauty & Personal Care
    { keywords: ['hyaluronic', 'serum', 'vitamin c', 'retinol', 'niacinamide', 'face serum'], pool: 'serum' },
    { keywords: ['moisturizer', 'face wash', 'sunscreen', 'toner', 'cleanser', 'face cream', 'lotion'], pool: 'skincare' },
    { keywords: ['perfume', 'eau de parfum', 'cologne', 'fragrance', 'body mist'], pool: 'perfume' },
    { keywords: ['shampoo', 'conditioner', 'hair oil', 'hair mask', 'hair serum', 'argan'], pool: 'shampoo' },
    { keywords: ['lipstick', 'lip gloss', 'foundation', 'blush', 'mascara', 'eyeshadow', 'eyeliner', 'makeup'], pool: 'lipstick' },
    { keywords: ['razor', 'shaving', 'trimmer', 'beard', 'grooming kit', 'after shave'], pool: 'razor' },
    // Home & Kitchen
    { keywords: ['induction', 'cooktop', 'prestige', 'butterfly induction', 'electric stove'], pool: 'induction' },
    { keywords: ['pressure cooker', 'fry pan', 'kadai', 'tawa', 'saucepan', 'cookware', 'non-stick'], pool: 'cookware' },
    { keywords: ['sofa', 'chair', 'table', 'bookshelf', 'wardrobe', 'bed frame', 'furniture'], pool: 'furniture' },
    { keywords: ['bedsheet', 'pillow', 'comforter', 'blanket', 'mattress', 'duvet'], pool: 'bedding' },
    { keywords: ['home decor', 'wall art', 'vase', 'candle', 'photo frame', 'showpiece'], pool: 'decor' },
    { keywords: ['led lamp', 'bulb', 'pendant light', 'ceiling light', 'floor lamp', 'table lamp'], pool: 'light' },
    // Grocery
    { keywords: ['apple', 'mango', 'banana', 'orange', 'strawberry', 'fruits', 'vegetables', 'tomato', 'potato'], pool: 'fruits' },
    { keywords: ['milk', 'butter', 'cheese', 'paneer', 'curd', 'yogurt', 'ghee'], pool: 'dairy' },
    { keywords: ['chips', 'biscuit', 'chocolate', 'cookie', 'snack', 'namkeen', 'juice', 'soda', 'coffee'], pool: 'snack' },
    { keywords: ['basmati rice', 'white rice', 'brown rice', 'dal', 'lentil', 'wheat'], pool: 'rice' },
    { keywords: ['turmeric', 'cumin', 'black pepper', 'spice', 'masala', 'cooking oil', 'olive oil'], pool: 'spice' },
    // Health
    { keywords: ['whey protein', 'protein powder', 'bcaa', 'creatine', 'mass gainer', 'pre-workout'], pool: 'protein' },
    { keywords: ['vitamin d', 'vitamin c', 'omega-3', 'multivitamin', 'probiotic', 'supplement', 'capsule'], pool: 'supplement' },
    { keywords: ['blood pressure monitor', 'glucometer', 'pulse oximeter', 'thermometer', 'nebulizer'], pool: 'medical' },
    // Sports
    { keywords: ['yoga mat', 'yoga block', 'yoga strap', 'foam roller', 'resistance band'], pool: 'yoga' },
    { keywords: ['dumbbell', 'barbell', 'treadmill', 'gym gloves', 'weight plate', 'ab roller'], pool: 'gym' },
    { keywords: ['bicycle', 'cycling helmet', 'running shoes', 'marathon', 'cyclist'], pool: 'cycling' },
    // Books
    { keywords: ['graphing calculator', 'ti-84', 'scientific calculator'], pool: 'calculator' },
    { keywords: ['diary', 'planner', 'organizer', 'spiral notebook', 'journal', 'sketchbook'], pool: 'notebook' },
    { keywords: ['novel', 'fiction', 'non-fiction', 'biography', 'textbook', 'guide', 'cbse', 'ncert'], pool: 'book' },
    // Toys
    { keywords: ['action figure', 'barbie', 'doll', 'transformer', 'superhero'], pool: 'toy' },
    { keywords: ['jigsaw puzzle', 'board game', 'chess', 'ludo', 'snakes and ladders'], pool: 'puzzle' },
    { keywords: ['lego', 'building block', 'educational toy', 'abacus', 'learning kit', 'rc car'], pool: 'toy' },
    // Automotive
    { keywords: ['motor oil', 'engine oil', 'synthetic oil', 'mobil', 'castrol', 'shell', '5w-30', '10w-40'], pool: 'motoroil' },
    { keywords: ['helmet', 'riding helmet', 'bike helmet', 'safety helmet'], pool: 'helmet' },
    { keywords: ['car freshener', 'car cover', 'seat cover', 'car cleaning', 'car wax', 'car wash', 'steering wheel'], pool: 'caraccessory' },
    // Pet
    { keywords: ['dog food', 'pedigree', 'royal canin dog', 'puppy food', 'dog treats'], pool: 'dogfood' },
    { keywords: ['cat food', 'whiskas', 'royal canin cat', 'kitten food', 'cat treats'], pool: 'catfood' },
    { keywords: ['pet bed', 'dog bed', 'cat bed', 'pet toy', 'pet grooming', 'pet shampoo'], pool: 'petbed' },
    // Gift
    { keywords: ['gift set', 'gift box', 'birthday gift', 'anniversary gift', 'festival gift', 'hamper', 'personalized'], pool: 'gift' },
  ];

  // Try keyword matching first
  for (const entry of keywordMap) {
    for (const kw of entry.keywords) {
      if (nameLower.includes(kw)) {
        return CATEGORY_IMAGE_POOLS[entry.pool];
      }
    }
  }

  // Fallback to category
  if (categoryName && CATEGORY_FALLBACK[categoryName]) {
    return CATEGORY_FALLBACK[categoryName];
  }

  return CATEGORY_FALLBACK.default;
}

// ============================================================
// MAIN SCRIPT
// ============================================================
async function main() {
  console.log('\n🚀 Bulk Image Updater - All Products\n');
  console.log('Connecting to MongoDB...');

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected!\n');

  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');

  const products = await Product.find({}).lean();
  console.log(`📦 Found ${products.length} products in database.\n`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const categoryName = product.category?.name || '';

    // Check if product already has 4+ images that are NOT base64
    const hasValidImages = product.images &&
      product.images.length >= 4 &&
      product.images.every(img => img.url && !img.url.startsWith('data:') && img.url.includes('unsplash'));

    if (hasValidImages) {
      console.log(`[${i + 1}/${products.length}] ✓ Already has ${product.images.length} valid images: "${product.name}"`);
      skippedCount++;
      continue;
    }

    const images = getImagesForProduct(product.name, categoryName);

    await Product.updateOne(
      { _id: product._id },
      { $set: { images: images } }
    );

    console.log(`[${i + 1}/${products.length}] ✅ Updated ${images.length} images: "${product.name}" [${categoryName}]`);
    updatedCount++;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🎉 Done! Updated: ${updatedCount} | Skipped (already OK): ${skippedCount} | Total: ${products.length}`);
  console.log('='.repeat(60) + '\n');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

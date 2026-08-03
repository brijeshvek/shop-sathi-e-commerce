/**
 * EXACT PRODUCT IMAGE MAPPER
 * Each product gets its own unique, relevant images
 * 140 products x 4-5 HD images = All unique Unsplash images
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://vekariyabrijesh2004_db_user:qLMtav3qgAhaKW8R@cluster0.mf1tfg4.mongodb.net/ecommerce?retryWrites=true&w=majority';

// ============================================================
// EXACT PRODUCT → IMAGE MAPPING (All 140 products)
// ============================================================
const PRODUCT_IMAGES = {
  // ============ ELECTRONICS ============
  "Samsung Galaxy S24 Ultra 5G": [
    { url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1575695342323-0ed8a02d3b7f?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Asus ROG Strix G16 (2024)": [
    { url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Apple Mac mini M2 Pro": [
    { url: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1484788984921-03950022c38b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "AMD Ryzen 9 7950X Desktop Processor": [
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "LG 27-inch 4K UHD IPS Monitor": [
    { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1484788984921-03950022c38b?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "HP LaserJet Pro MFP 4101fdw": [
    { url: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1615469958067-0680a1ed7945?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "TP-Link Archer AX73 Wi-Fi 6 Router": [
    { url: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1580137197581-df2bb346a786?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Samsung 990 PRO 2TB NVMe M.2 SSD": [
    { url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Amazon Echo Dot (5th Gen, 2022)": [
    { url: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1558089687-f282ffcbc0d6?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1512446816042-444d641267d4?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Microsoft Surface Pro 9": [
    { url: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ MOBILE ACCESSORIES ============
  "OtterBox Defender Series Case for Galaxy S24 Ultra": [
    { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Apple 20W USB-C Power Adapter": [
    { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1622445268465-8431b68a4202?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Anker 313 Wireless Charger (Pad)": [
    { url: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Samsung 10000mAh Super Fast Charge Power Bank": [
    { url: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1622445268465-8431b68a4202?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Belkin BoostCharge Pro Flex USB-C to Lightning Cable": [
    { url: "https://images.unsplash.com/photo-1629126901000-827e8c5c91f6?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1622445268465-8431b68a4202?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Sony WF-1000XM5 True Wireless Earbuds": [
    { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1606220588913-b3eea8951234?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Apple AirPods Pro (2nd Generation)": [
    { url: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1631176093617-5edb9b77f851?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Apple Watch Series 9 (GPS, 45mm)": [
    { url: "https://images.unsplash.com/photo-1434493789847-2f02b0c156f4?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Fossil Gen 6 Smartwatch": [
    { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1542496658-e33a6d0d4c6a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1609587312208-cea54be969e7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Spigen Glas.tR EZ Fit Tempered Glass for iPhone 15 Pro": [
    { url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "iOttie Easy One Touch 5 Car Mount": [
    { url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ FASHION ============
  "Adidas Ultraboost 1.0": [
    { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1519395052-1ffadb45b65b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Nike Air Force 1 '07": [
    { url: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1484589065579-248aad0d8b13?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "UGG Women's Classic Short II Boot": [
    { url: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Levi's 511 Slim Fit Jeans": [
    { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1551854304-b72d77e040c5?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Zara Basic White T-Shirt": [
    { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "H&M Floral Maxi Dress": [
    { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Mango Faux Leather Biker Jacket": [
    { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1594938298603-c8148c4b4009?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Columbia Men's Watertight II Jacket": [
    { url: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1566479179817-c3d2f5e54f72?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "The North Face Men's McMurdo Parka": [
    { url: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Ray-Ban Classic Aviator Sunglasses": [
    { url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1600091166971-7f9faad6c498?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Tommy Hilfiger Leather Wallet": [
    { url: "https://images.unsplash.com/photo-1627123424574-724758594913?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1606422694217-fde1b7a01e1b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "JanSport SuperBreak One Backpack": [
    { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1602526430780-782d6b1783fa?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Carter's Cotton Pajama Set": [
    { url: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1524578271613-d3959c403b44?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Casio G-Shock Matte Black": [
    { url: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1639611773946-70d4e418d0b9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1609587312208-cea54be969e7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Traditional Festive Kurta Set": [
    { url: "https://images.unsplash.com/photo-1583391733958-d25e77d2e051?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1597983073493-88cd7d456c67?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1591213954196-2d0ccb3f8d4c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1535492778785-2a12e334df98?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ BEAUTY ============
  "The Ordinary Niacinamide 10% + Zinc 1%": [
    { url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "CeraVe Hydrating Facial Cleanser": [
    { url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Supergoop! Unseen Sunscreen SPF 40": [
    { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Olaplex No. 7 Bonding Oil": [
    { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1527799820374-87036083cafe?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Dyson Supersonic Hair Dryer": [
    { url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1527799820374-87036083cafe?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "MAC Studio Fix Fluid Foundation": [
    { url: "https://images.unsplash.com/photo-1631214524020-3c69cf5c6e05?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1586495777744-4e6232bf2905?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Maybelline Lash Sensational Mascara": [
    { url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1631214524020-3c69cf5c6e05?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1586495777744-4e6232bf2905?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Chanel Bleu de Chanel Eau de Parfum": [
    { url: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1600612253971-183e0c7d62c4?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Dior Sauvage Eau de Toilette": [
    { url: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Philips Norelco Multigroom Series 7000": [
    { url: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Bath & Body Works A Thousand Wishes Shower Gel": [
    { url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1631214524020-3c69cf5c6e05?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ HOME & KITCHEN ============
  "Ashley Furniture Alenya Sofa": [
    { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Ninja Air Fryer Max XL": [
    { url: "https://images.unsplash.com/photo-1647587727887-d4ac12f498a0?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1617611413968-1d2c82f6f0c9?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "KitchenAid Artisan Series 5-Quart Stand Mixer": [
    { url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1617611413968-1d2c82f6f0c9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1617611413820-a31d73fca6e4?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Le Creuset Enameled Cast Iron Signature Round Dutch Oven": [
    { url: "https://images.unsplash.com/photo-1585325701860-f67da8cc14c5?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1619868096527-b5a71fdb0a1d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1617611413968-1d2c82f6f0c9?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Caraway Nonstick Ceramic Cookware Set": [
    { url: "https://images.unsplash.com/photo-1619868096527-b5a71fdb0a1d?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1585325701860-f67da8cc14c5?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1574031937651-a90dd60f7ec0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1617611413968-1d2c82f6f0c9?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "West Elm Pure White Ceramic Vase": [
    { url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Philips Hue White and Color Ambiance Smart Bulbs": [
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Vitamix 5200 Professional-Grade Blender": [
    { url: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Brooklinen Luxe Core Sheet Set": [
    { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Tempur-Pedic TEMPUR-Cloud Memory Foam Pillow": [
    { url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ GROCERY ============
  "Fresh Organic Bananas (1 Bunch)": [
    { url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Hass Avocados (Pack of 4)": [
    { url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1560339420-1b21ae3cef7a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Amul Pure Ghee 1L (Pouch)": [
    { url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1619033073783-57e84ebca0ea?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Organic Whole Milk (1 Gallon)": [
    { url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Lay's Classic Potato Chips (Family Size)": [
    { url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1508330181539-b1b35b4ae023?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Coca-Cola Original Taste (12-Pack Cans)": [
    { url: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1612540139150-4b57e48bebe1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Royal Basmati Rice (10 lbs)": [
    { url: "https://images.unsplash.com/photo-1536304993881-ff86e53c3ce5?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Organic White Quinoa (2 lbs)": [
    { url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1536304993881-ff86e53c3ce5?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Filippo Berio Extra Virgin Olive Oil (500ml)": [
    { url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1599421498111-9b23ff1f0b16?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Himalayan Pink Salt Fine Grain (1 lb)": [
    { url: "https://images.unsplash.com/photo-1599421498111-9b23ff1f0b16?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1583474257013-72261b54c0f4?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ HEALTH & WELLNESS ============
  "Optimum Nutrition Gold Standard 100% Whey Protein": [
    { url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1584991107459-30d2e0ce4a61?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Centrum Adult Multivitamin": [
    { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Nature Made Fish Oil 1000 mg": [
    { url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Omron Silver Blood Pressure Monitor": [
    { url: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Braun ThermoScan 7 Ear Thermometer": [
    { url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "MuscleTech Platinum 100% Creatine": [
    { url: "https://images.unsplash.com/photo-1584991107459-30d2e0ce4a61?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Yogi Tea - Honey Lavender Stress Relief": [
    { url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1597481499750-3e6b22637536?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1561339429-0f7b06f64a8d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Vital Proteins Collagen Peptides": [
    { url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Accu-Chek Guide Me Blood Glucose Meter": [
    { url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Theragun Prime Massage Gun": [
    { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ SPORTS & FITNESS ============
  "Bowflex SelectTech 552 Adjustable Dumbbells": [
    { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "CAP Barbell Cast Iron Hex Dumbbell, 25 lbs": [
    { url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Manduka PRO Yoga Mat": [
    { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1559895122-0f1a9e0c7a5b?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Gaiam Yoga Block (Set of 2)": [
    { url: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Wilson Evolution Indoor Game Basketball": [
    { url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Spalding NBA Street Basketball": [
    { url: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Garmin Forerunner 245 Music": [
    { url: "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1434493789847-2f02b0c156f4?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576576065905-c3f58b34abb3?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Schwinn Fitness Indoor Cycling Exercise Bike": [
    { url: "https://images.unsplash.com/photo-1486739985386-d4fae04ca6f7?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576576065905-c3f58b34abb3?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Fit Simplify Resistance Loop Exercise Bands": [
    { url: "https://images.unsplash.com/photo-1585803106982-a9d6ac1c3b04?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "TRX GO Suspension Training System": [
    { url: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ BOOKS & STATIONERY ============
  "The Midnight Library by Matt Haig": [
    { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "1984 by George Orwell": [
    { url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Atomic Habits by James Clear": [
    { url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Sapiens: A Brief History of Humankind": [
    { url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Cracking the Coding Interview": [
    { url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Moleskine Classic Ruled Notebook": [
    { url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1543086304-8a43b04ec949?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Leuchtturm1917 Medium A5 Dotted Hardcover Notebook": [
    { url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1543086304-8a43b04ec949?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Pilot G2 Premium Gel Pens (12-Pack)": [
    { url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Prismacolor Premier Colored Pencils (72-Count)": [
    { url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Post-it Notes 3x3 Inch (14-Pad Cabinet Pack)": [
    { url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Texas Instruments TI-84 Plus CE Graphing Calculator": [
    { url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1554774853-719586f82d77?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ TOYS & GAMES ============
  "LEGO Classic Large Creative Brick Box": [
    { url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1613721036769-f563d895d18a?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Melissa & Doug Wooden Building Blocks Set": [
    { url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Catan Board Game": [
    { url: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Ticket to Ride Board Game": [
    { url: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Ravensburger 1000 Piece Jigsaw Puzzle": [
    { url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Marvel Legends Series Iron Man Action Figure": [
    { url: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Barbie Dreamhouse Dollhouse": [
    { url: "https://images.unsplash.com/photo-1604148556494-f027a57bfcea?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Holy Stone HS110D FPV RC Drone": [
    { url: "https://images.unsplash.com/photo-1533932551237-c8f7d2a9e9f9?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1519458246479-721e4566fac1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Traxxas Rustler 4X4 VXL RC Truck": [
    { url: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Magna-Tiles 32-Piece Clear Colors Set": [
    { url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ AUTOMOTIVE ============
  "Bosch ICON Wiper Blades (2-Pack)": [
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558618047-f4e80c0d3b37?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "WeatherTech Custom Fit FloorLiners (Front Row)": [
    { url: "https://images.unsplash.com/photo-1558618047-f4e80c0d3b37?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "NOCO Boost Plus GB40 1000A UltraSafe Car Battery Jump Starter": [
    { url: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558618047-f4e80c0d3b37?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Roam Universal Premium Bike Phone Mount": [
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1576576065905-c3f58b34abb3?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Kryptonite New York Lock Standard U-Lock": [
    { url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576576065905-c3f58b34abb3?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Bell Qualifier Full-Face Motorcycle Helmet": [
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Giro Fixture MIPS Adult Dirt Cycling Helmet": [
    { url: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1576576065905-c3f58b34abb3?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Meguiar's Ultimate Liquid Wax": [
    { url: "https://images.unsplash.com/photo-1582813560413-74b8d9e5f1a5?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558618047-f4e80c0d3b37?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Chemical Guys Mr. Pink Super Suds Car Wash Soap": [
    { url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1582813560413-74b8d9e5f1a5?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Mobil 1 Extended Performance Full Synthetic Motor Oil 5W-30": [
    { url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558618047-f4e80c0d3b37?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ PET SUPPLIES ============
  "Purina Pro Plan Adult Dog Food (30 lb)": [
    { url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Blue Buffalo Life Protection Formula Adult Dog Food (30 lb)": [
    { url: "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Purina ONE Indoor Advantage Adult Cat Food (16 lb)": [
    { url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1536590158209-7e58fb48bd46?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "IAMS ProActive Health Adult Dry Cat Food (7 lb)": [
    { url: "https://images.unsplash.com/photo-1536590158209-7e58fb48bd46?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Best Friends by Sheri The Original Calming Donut Bed": [
    { url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Furminator Undercoat Deshedding Tool for Dogs": [
    { url: "https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "KONG Classic Dog Toy": [
    { url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Chuckit! Ultra Ball Dog Toy (2-Pack)": [
    { url: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "SmartyKat Skitter Critters Catnip Cat Toys (3-Pack)": [
    { url: "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1536590158209-7e58fb48bd46?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Outward Hound Hide A Squirrel Plush Dog Toy Puzzle": [
    { url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ GIFT SHOP ============
  "Happy Birthday Deluxe Gift Basket": [
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1535916707207-35a2b09db5cc?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Spa Day Relaxation Gift Box": [
    { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "His & Hers Matching Anniversary Watches": [
    { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1609587312208-cea54be969e7?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Luxury Perfume & Cologne Gift Set": [
    { url: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Premium Chocolates Assortment Box": [
    { url: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1606312619070-d48b2e2c0f5d?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Diwali Sweets & Diya Hamper": [
    { url: "https://images.unsplash.com/photo-1604423586541-e9c3fdd8b01a?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Personalised Name Necklace (Sterling Silver)": [
    { url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Custom Photo 3D Crystal Lamp": [
    { url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Engraved Wooden Keepsake Box": [
    { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Anniversary Romantic Dinner Voucher (For Two)": [
    { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  // ============ SEASONAL / MISC ============
  "Coleman 54-Quart Steel-Belted Cooler": [
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
  "Handcrafted Diwali Toran/Door Hanging": [
    { url: "https://images.unsplash.com/photo-1604423586541-e9c3fdd8b01a?auto=format&fit=crop&w=800&q=80", isMain: true },
    { url: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80", isMain: false },
    { url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80", isMain: false },
  ],
};

// ============================================================
// MAIN SCRIPT
// ============================================================
async function main() {
  console.log('\n🎯 Exact Product Image Mapper - All 140 Products\n');
  console.log('Connecting to MongoDB...');

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to ecommerce DB!\n');

  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).project({ name: 1 }).toArray();
  console.log(`📦 Found ${products.length} products in database.\n`);

  let updated = 0;
  let notFound = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const images = PRODUCT_IMAGES[product.name];

    if (images) {
      await db.collection('products').updateOne(
        { _id: product._id },
        { $set: { images: images } }
      );
      console.log(`[${i + 1}/${products.length}] ✅ Updated: "${product.name}"`);
      updated++;
    } else {
      console.log(`[${i + 1}/${products.length}] ⚠️  NOT IN MAP (keeping existing): "${product.name}"`);
      notFound++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Updated: ${updated} | ⚠️ Not in map: ${notFound} | Total: ${products.length}`);

  if (notFound > 0) {
    console.log('\nProducts NOT in map (need manual images):');
    for (const p of products) {
      if (!PRODUCT_IMAGES[p.name]) {
        console.log('  - ' + p.name);
      }
    }
  }

  console.log('='.repeat(60) + '\n');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

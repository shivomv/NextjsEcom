const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Order = require('../models/orderModel');
const Review = require('../models/reviewModel');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    phone: '9876543210',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '9876543211',
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    phone: '9876543212',
  },
];

// Sample categories
const categories = [
  {
    name: 'Religious Idols',
    hindiName: 'धार्मिक मूर्तियां',
    slug: 'idols',
    description: 'Authentic and traditionally crafted religious idols made with pure materials',
    image: '/images/categories/idols-banner.jpg',
    isActive: true,
    parentCategory: null,
  },
  {
    name: 'Cow Products',
    hindiName: 'गौ उत्पाद',
    slug: 'cow-products',
    description: 'Pure and authentic cow products made from indigenous cow breeds',
    image: '/images/categories/cow-products-banner.jpg',
    isActive: true,
    parentCategory: null,
  },
  {
    name: 'Diwali Special',
    hindiName: 'दिवाली विशेष',
    slug: 'diwali',
    description: 'Traditional and eco-friendly products for the festival of lights',
    image: '/images/categories/diwali-banner.jpg',
    isActive: true,
    parentCategory: null,
    festivalRelated: true,
    festivalName: 'Diwali',
  },
  {
    name: 'Spiritual Gifts',
    hindiName: 'आध्यात्मिक उपहार',
    slug: 'gifts',
    description: 'Meaningful spiritual gifts for all occasions',
    image: '/images/categories/gifts-banner.jpg',
    isActive: true,
    parentCategory: null,
  },
  {
    name: 'Puja Items',
    hindiName: 'पूजा सामग्री',
    slug: 'puja-items',
    description: 'Essential items for daily puja and religious ceremonies',
    image: '/images/categories/puja-items-banner.jpg',
    isActive: true,
    parentCategory: null,
  },
];

// Sample products (to be populated with category IDs after categories are created)
const productsTemplate = [
  {
    name: 'Brass Ganesh Idol',
    hindiName: 'पीतल गणेश मूर्ति',
    slug: 'brass-ganesh-idol',
    description: 'Beautifully crafted brass Ganesh idol, perfect for home temples and gifting on Ganesh Chaturthi.',
    spiritualSignificance: 'Lord Ganesh is revered as the remover of obstacles and the god of new beginnings. This idol is crafted following traditional guidelines to bring prosperity and success.',
    price: 1299,
    comparePrice: 1599,
    images: ['/images/products/ganesh-idol.jpg'],
    stock: 50,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    materials: ['Brass'],
    dimensions: {
      length: 15,
      width: 10,
      height: 20,
      unit: 'cm',
    },
    weight: {
      value: 1.2,
      unit: 'kg',
    },
    ratings: 4.8,
    numReviews: 124,
    tags: ['Ganesh', 'Brass', 'Idol', 'Puja'],
    seo: {
      metaTitle: 'Brass Ganesh Idol - Traditional Handcrafted',
      metaDescription: 'Buy authentic brass Ganesh idol crafted by skilled artisans following traditional methods.',
      metaKeywords: 'brass ganesh, ganesh idol, ganesh murti, brass murti',
    },
  },
  {
    name: 'Pure Cow Ghee',
    hindiName: 'शुद्ध गाय का घी',
    slug: 'pure-cow-ghee',
    description: 'Pure and authentic A2 cow ghee made from the milk of indigenous cows raised in traditional gaushalas.',
    spiritualSignificance: 'Cow ghee is considered sacred in Hindu traditions and is used in various religious ceremonies and yagnas. It is believed to have healing properties and enhances the spiritual energy of rituals.',
    price: 699,
    comparePrice: 799,
    images: ['/images/products/cow-ghee.jpg'],
    stock: 100,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    materials: ['A2 Cow Milk'],
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: 'cm',
    },
    weight: {
      value: 500,
      unit: 'g',
    },
    ratings: 4.9,
    numReviews: 215,
    tags: ['Cow Ghee', 'A2 Ghee', 'Puja', 'Ayurveda'],
    seo: {
      metaTitle: 'Pure A2 Cow Ghee - Traditional & Authentic',
      metaDescription: 'Buy pure A2 cow ghee made from the milk of indigenous cows raised in traditional gaushalas.',
      metaKeywords: 'cow ghee, a2 ghee, pure ghee, desi ghee',
    },
  },
  {
    name: 'Handmade Clay Diyas (Set of 12)',
    hindiName: 'हस्तनिर्मित मिट्टी के दीये (12 का सेट)',
    slug: 'handmade-clay-diyas',
    description: 'Traditional handmade clay diyas crafted by skilled artisans. Perfect for Diwali celebrations and other auspicious occasions.',
    spiritualSignificance: 'Lighting diyas symbolizes the victory of light over darkness and knowledge over ignorance. These clay diyas are made with reverence to traditional craftsmanship.',
    price: 349,
    comparePrice: 499,
    images: ['/images/products/clay-diyas.jpg'],
    stock: 200,
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    festivalRelated: true,
    festivalName: 'Diwali',
    materials: ['Natural Clay'],
    dimensions: {
      length: 5,
      width: 5,
      height: 2,
      unit: 'cm',
    },
    weight: {
      value: 600,
      unit: 'g',
    },
    ratings: 4.8,
    numReviews: 186,
    tags: ['Diwali', 'Diyas', 'Clay', 'Handmade'],
    seo: {
      metaTitle: 'Handmade Clay Diyas - Traditional Diwali Lamps',
      metaDescription: 'Buy traditional handmade clay diyas for Diwali celebrations, crafted by skilled artisans.',
      metaKeywords: 'clay diyas, diwali diyas, handmade diyas, traditional diyas',
    },
  },
  {
    name: 'Rudraksha Mala',
    hindiName: 'रुद्राक्ष माला',
    slug: 'rudraksha-mala',
    description: 'Authentic 108-bead Rudraksha mala sourced from the Himalayas, perfect for meditation and spiritual practices.',
    spiritualSignificance: 'Rudraksha beads are sacred to Lord Shiva and are believed to have powerful healing and spiritual properties. Wearing or using a Rudraksha mala during meditation helps in concentration and spiritual growth.',
    price: 799,
    comparePrice: 999,
    images: ['/images/products/rudraksha-mala.jpg'],
    stock: 30,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    materials: ['Rudraksha', 'Cotton Thread'],
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: 'cm',
    },
    weight: {
      value: 50,
      unit: 'g',
    },
    ratings: 4.8,
    numReviews: 112,
    tags: ['Rudraksha', 'Mala', 'Meditation', 'Spiritual'],
    seo: {
      metaTitle: 'Authentic Rudraksha Mala - 108 Beads',
      metaDescription: 'Buy authentic 108-bead Rudraksha mala sourced from the Himalayas for meditation and spiritual practices.',
      metaKeywords: 'rudraksha mala, 108 beads, meditation mala, spiritual mala',
    },
  },
  {
    name: 'Brass Puja Thali Set',
    hindiName: 'पीतल पूजा थाली सेट',
    slug: 'brass-puja-thali-set',
    description: 'Complete brass puja thali set including all essential items for daily worship and rituals.',
    spiritualSignificance: 'A puja thali is an essential part of Hindu worship rituals. This set contains all the items needed for proper worship according to traditional guidelines.',
    price: 1499,
    comparePrice: 1799,
    images: ['/images/products/puja-thali.jpg'],
    stock: 40,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    materials: ['Brass'],
    dimensions: {
      length: 30,
      width: 30,
      height: 5,
      unit: 'cm',
    },
    weight: {
      value: 1.5,
      unit: 'kg',
    },
    ratings: 4.7,
    numReviews: 95,
    tags: ['Puja Thali', 'Brass', 'Puja Items', 'Worship'],
    seo: {
      metaTitle: 'Brass Puja Thali Set - Complete Worship Kit',
      metaDescription: 'Buy complete brass puja thali set with all essential items for daily worship and rituals.',
      metaKeywords: 'puja thali, brass thali, worship set, puja items',
    },
  },
];

// Sample reviews (to be populated with product and user IDs after they are created)
const reviewsTemplate = [
  {
    rating: 5,
    comment: 'Excellent quality product. The craftsmanship is outstanding and it arrived well-packaged.',
    title: 'Beautiful craftsmanship',
  },
  {
    rating: 4,
    comment: 'Very good product. Slightly smaller than I expected but the quality is great.',
    title: 'Good quality',
  },
  {
    rating: 5,
    comment: 'Absolutely love this! It has become an integral part of my daily spiritual practice.',
    title: 'Perfect for daily worship',
  },
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();

    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const regularUser1 = createdUsers[1]._id;
    const regularUser2 = createdUsers[2]._id;

    console.log('Users created');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories created');

    // Map category slugs to their IDs
    const categoryMap = {};
    createdCategories.forEach(category => {
      categoryMap[category.slug] = category._id;
    });

    // Assign categories to products
    const products = productsTemplate.map(product => {
      let categoryId;

      if (product.name.includes('Ganesh') || product.name.includes('Idol')) {
        categoryId = categoryMap['idols'];
      } else if (product.name.includes('Cow') || product.name.includes('Ghee')) {
        categoryId = categoryMap['cow-products'];
      } else if (product.name.includes('Diya') || product.festivalRelated) {
        categoryId = categoryMap['diwali'];
      } else if (product.name.includes('Rudraksha') || product.name.includes('Mala')) {
        categoryId = categoryMap['gifts'];
      } else if (product.name.includes('Puja') || product.name.includes('Thali')) {
        categoryId = categoryMap['puja-items'];
      } else {
        // Default category
        categoryId = categoryMap['puja-items'];
      }

      return {
        ...product,
        category: categoryId,
        user: adminUser, // All products created by admin
      };
    });

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log('Products created');

    // Create reviews for products
    const reviews = [];

    // Create 2-3 reviews for each product
    createdProducts.forEach(product => {
      // First review by admin
      reviews.push({
        user: adminUser,
        product: product._id,
        ...reviewsTemplate[0],
        name: 'Admin User',
      });

      // Second review by regular user 1
      reviews.push({
        user: regularUser1,
        product: product._id,
        ...reviewsTemplate[1],
        name: 'John Doe',
      });

      // Third review for some products by regular user 2
      if (Math.random() > 0.3) { // 70% chance to have a third review
        reviews.push({
          user: regularUser2,
          product: product._id,
          ...reviewsTemplate[2],
          name: 'Jane Doe',
        });
      }
    });

    await Review.insertMany(reviews);
    console.log('Reviews created');

    // Create sample orders
    const orders = [
      {
        user: regularUser1,
        orderItems: [
          {
            name: createdProducts[0].name,
            hindiName: createdProducts[0].hindiName || createdProducts[0].name,
            qty: 1,
            image: createdProducts[0].images[0],
            price: createdProducts[0].price,
            product: createdProducts[0]._id,
          },
          {
            name: createdProducts[1].name,
            hindiName: createdProducts[1].hindiName || createdProducts[1].name,
            qty: 2,
            image: createdProducts[1].images[0],
            price: createdProducts[1].price,
            product: createdProducts[1]._id,
          },
        ],
        shippingAddress: {
          addressLine1: '123 Temple Street',
          addressLine2: 'Spiritual District',
          city: 'New Delhi',
          postalCode: '110001',
          country: 'India',
          state: 'Delhi',
        },
        paymentMethod: 'UPI',
        paymentResult: {
          id: 'UPI123456789',
          status: 'COMPLETED',
          update_time: Date.now(),
          email_address: 'john@example.com',
        },
        itemsPrice: createdProducts[0].price + (createdProducts[1].price * 2),
        taxPrice: Math.round((createdProducts[0].price + (createdProducts[1].price * 2)) * 0.05),
        shippingPrice: 0, // Free shipping
        totalPrice: createdProducts[0].price + (createdProducts[1].price * 2) + Math.round((createdProducts[0].price + (createdProducts[1].price * 2)) * 0.05),
        isPaid: true,
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        orderStatus: 'Delivered',
      },
      {
        user: regularUser2,
        orderItems: [
          {
            name: createdProducts[2].name,
            hindiName: createdProducts[2].hindiName || createdProducts[2].name,
            qty: 1,
            image: createdProducts[2].images[0],
            price: createdProducts[2].price,
            product: createdProducts[2]._id,
          },
        ],
        shippingAddress: {
          addressLine1: '456 Spiritual Avenue',
          addressLine2: 'Devotional Complex',
          city: 'Mumbai',
          postalCode: '400001',
          country: 'India',
          state: 'Maharashtra',
        },
        paymentMethod: 'Card',
        paymentResult: {
          id: 'CC987654321',
          status: 'COMPLETED',
          update_time: Date.now(),
          email_address: 'jane@example.com',
        },
        itemsPrice: createdProducts[2].price,
        taxPrice: Math.round(createdProducts[2].price * 0.05),
        shippingPrice: 50, // Standard shipping
        totalPrice: createdProducts[2].price + Math.round(createdProducts[2].price * 0.05) + 50,
        isPaid: true,
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        isDelivered: false,
        orderStatus: 'Processing',
      },
      {
        user: regularUser1,
        orderItems: [
          {
            name: createdProducts[3].name,
            hindiName: createdProducts[3].hindiName || createdProducts[3].name,
            qty: 1,
            image: createdProducts[3].images[0],
            price: createdProducts[3].price,
            product: createdProducts[3]._id,
          },
          {
            name: createdProducts[4].name,
            hindiName: createdProducts[4].hindiName || createdProducts[4].name,
            qty: 1,
            image: createdProducts[4].images[0],
            price: createdProducts[4].price,
            product: createdProducts[4]._id,
          },
        ],
        shippingAddress: {
          addressLine1: '123 Temple Street',
          addressLine2: 'Spiritual District',
          city: 'New Delhi',
          postalCode: '110001',
          country: 'India',
          state: 'Delhi',
        },
        paymentMethod: 'Wallet',
        itemsPrice: createdProducts[3].price + createdProducts[4].price,
        taxPrice: Math.round((createdProducts[3].price + createdProducts[4].price) * 0.05),
        shippingPrice: 0, // Free shipping
        totalPrice: createdProducts[3].price + createdProducts[4].price + Math.round((createdProducts[3].price + createdProducts[4].price) * 0.05),
        isPaid: false,
        isDelivered: false,
        orderStatus: 'Processing',
      },
    ];

    await Order.insertMany(orders);
    console.log('Orders created');

    console.log('Data imported successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();

    console.log('Data destroyed successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin@123456789',
    phone: '9876543210',
    role: 'admin',
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    password: 'User@123456789',
    phone: '9876543211',
    role: 'user',
  },
];

const categories = [
  {
    name: 'Puja Items',
    description: 'Essential items for daily puja and worship',
    isFestival: false,
    isActive: true,
    order: 1,
  },
  {
    name: 'Ganesh Idols',
    description: 'Beautiful Ganesh idols for worship and decoration',
    isFestival: false,
    isActive: true,
    order: 2,
  },
  {
    name: 'Cow Dung Products',
    description: 'Eco-friendly products made from cow dung',
    isFestival: false,
    isActive: true,
    order: 3,
  },
  {
    name: 'Diwali Special',
    description: 'Special items for Diwali celebration',
    isFestival: true,
    isActive: true,
    order: 4,
  },
  {
    name: 'Holi Special',
    description: 'Colorful items for Holi festival',
    isFestival: true,
    isActive: true,
    order: 5,
  },
];

const products = [
  {
    name: 'Brass Diya Set',
    description: 'Traditional brass diya set for daily puja. Set of 5 handcrafted diyas.',
    brand: 'Prashasak Samiti',
    image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    price: 299,
    mrp: 499,
    stock: 50,
    isFeatured: true,
    isActive: true,
    specifications: [
      { name: 'Material', value: 'Brass' },
      { name: 'Quantity', value: '5 pieces' },
      { name: 'Height', value: '2 inches' },
    ],
    tags: ['puja', 'diya', 'brass', 'traditional'],
  },
  {
    name: 'Ganesh Idol - Small',
    description: 'Beautiful small Ganesh idol made from eco-friendly materials. Perfect for home temple.',
    brand: 'Prashasak Samiti',
    image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    price: 199,
    mrp: 299,
    stock: 100,
    isFeatured: true,
    isActive: true,
    specifications: [
      { name: 'Material', value: 'Eco-friendly clay' },
      { name: 'Height', value: '4 inches' },
      { name: 'Color', value: 'Natural' },
    ],
    tags: ['ganesh', 'idol', 'eco-friendly', 'clay'],
  },
  {
    name: 'Cow Dung Incense Sticks',
    description: 'Natural incense sticks made from pure cow dung. Pack of 50 sticks.',
    brand: 'Prashasak Samiti',
    image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    price: 149,
    mrp: 199,
    stock: 200,
    isFeatured: false,
    isActive: true,
    specifications: [
      { name: 'Material', value: 'Cow dung' },
      { name: 'Quantity', value: '50 sticks' },
      { name: 'Fragrance', value: 'Natural' },
    ],
    tags: ['incense', 'cow-dung', 'natural', 'eco-friendly'],
  },
  {
    name: 'Puja Thali Set',
    description: 'Complete puja thali set with all essential items. Includes thali, diya, bell, and more.',
    brand: 'Prashasak Samiti',
    image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    price: 599,
    mrp: 899,
    stock: 30,
    isFeatured: true,
    isActive: true,
    specifications: [
      { name: 'Material', value: 'Brass & Copper' },
      { name: 'Items', value: '8 pieces' },
      { name: 'Diameter', value: '10 inches' },
    ],
    tags: ['puja', 'thali', 'brass', 'complete-set'],
  },
  {
    name: 'Ganesh Idol - Medium',
    description: 'Medium-sized Ganesh idol with intricate details. Handcrafted by skilled artisans.',
    brand: 'Prashasak Samiti',
    image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    price: 399,
    mrp: 599,
    stock: 75,
    isFeatured: true,
    isActive: true,
    specifications: [
      { name: 'Material', value: 'Eco-friendly clay' },
      { name: 'Height', value: '8 inches' },
      { name: 'Color', value: 'Multi-color' },
    ],
    tags: ['ganesh', 'idol', 'handcrafted', 'medium'],
  },
  {
    name: 'Cow Dung Dhoop Cones',
    description: 'Aromatic dhoop cones made from pure cow dung. Pack of 24 cones.',
    brand: 'Prashasak Samiti',
    image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    price: 99,
    mrp: 149,
    stock: 150,
    isFeatured: false,
    isActive: true,
    specifications: [
      { name: 'Material', value: 'Cow dung' },
      { name: 'Quantity', value: '24 cones' },
      { name: 'Burn time', value: '15 minutes each' },
    ],
    tags: ['dhoop', 'cow-dung', 'aromatic', 'natural'],
  },
  {
    name: 'Diwali Diya Set - Premium',
    description: 'Premium decorative diya set for Diwali. Set of 10 colorful diyas.',
    brand: 'Prashasak Samiti',
    image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    price: 499,
    mrp: 799,
    stock: 40,
    isFeatured: true,
    isActive: true,
    specifications: [
      { name: 'Material', value: 'Clay & Paint' },
      { name: 'Quantity', value: '10 pieces' },
      { name: 'Design', value: 'Hand-painted' },
    ],
    tags: ['diwali', 'diya', 'decorative', 'festival'],
  },
  {
    name: 'Holi Color Powder - Natural',
    description: 'Natural and skin-safe Holi color powder. Pack of 5 colors.',
    brand: 'Prashasak Samiti',
    image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    price: 299,
    mrp: 449,
    stock: 100,
    isFeatured: true,
    isActive: true,
    specifications: [
      { name: 'Material', value: 'Natural herbs' },
      { name: 'Colors', value: '5 different colors' },
      { name: 'Weight', value: '100g each' },
    ],
    tags: ['holi', 'colors', 'natural', 'safe'],
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Existing data cleared');

    // Create users
    console.log('Creating users...');
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await Category.create(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Assign categories to products
    const productsWithCategories = products.map((product, index) => {
      let categoryIndex;
      if (product.name.includes('Diya') || product.name.includes('Puja')) {
        categoryIndex = 0; // Puja Items
      } else if (product.name.includes('Ganesh')) {
        categoryIndex = 1; // Ganesh Idols
      } else if (product.name.includes('Cow Dung')) {
        categoryIndex = 2; // Cow Dung Products
      } else if (product.name.includes('Diwali')) {
        categoryIndex = 3; // Diwali Special
      } else if (product.name.includes('Holi')) {
        categoryIndex = 4; // Holi Special
      } else {
        categoryIndex = 0; // Default to Puja Items
      }

      return {
        ...product,
        user: createdUsers[0]._id, // Assign to admin user
        category: createdCategories[categoryIndex]._id,
      };
    });

    // Create products
    console.log('Creating products...');
    const createdProducts = await Product.create(productsWithCategories);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@example.com / Admin@123456');
    console.log('User: user@example.com / User@123456');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

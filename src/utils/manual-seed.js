// Manual seeding script
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbConnect from './db';

// Import models
import User from '@/models/userModel';
import Category from '@/models/categoryModel';

async function seedUsers() {
  try {
    console.log('Checking for existing users...');
    const count = await User.countDocuments();
    
    if (count === 0) {
      console.log('No users found. Creating admin user...');
      
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '9876543210',
        role: 'admin',
      });
      
      await adminUser.save();
      console.log('Admin user created successfully!');
    } else {
      console.log(`Found ${count} existing users. Skipping user creation.`);
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

async function seedCategories() {
  try {
    console.log('Checking for existing categories...');
    const count = await Category.countDocuments();
    
    if (count === 0) {
      console.log('No categories found. Creating categories...');
      
      const categories = [
        {
          name: 'Religious Books',
          description: 'Sacred texts and religious literature',
          image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/religious-books',
          isFestival: false,
          isActive: true,
          order: 1,
        },
        {
          name: 'Pooja Items',
          description: 'Essential items for religious ceremonies',
          image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/pooja-items',
          isFestival: false,
          isActive: true,
          order: 2,
        },
        {
          name: 'Idols & Statues',
          description: 'Authentic and traditionally crafted religious idols',
          image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/idols',
          isFestival: false,
          isActive: true,
          order: 3,
        },
      ];
      
      await Category.insertMany(categories);
      console.log('Categories created successfully!');
    } else {
      console.log(`Found ${count} existing categories. Skipping category creation.`);
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

async function runSeed() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    
    // Seed users first
    await seedUsers();
    
    // Then seed categories
    await seedCategories();
    
    console.log('Seeding completed successfully!');
    
    // Close the connection
    await mongoose.disconnect();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

// Run the seeding function
runSeed();

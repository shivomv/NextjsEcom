const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
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

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();

    // Create users
    await User.insertMany(users);

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

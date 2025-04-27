// CommonJS seeding script
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
console.log('Connecting to MongoDB:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    return seedDatabase();
  })
  .then(() => {
    console.log('Seeding completed');
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('MongoDB disconnected');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });

async function seedDatabase() {
  // Define user schema
  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  }, { timestamps: true });

  // Define category schema
  const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    slug: {
      type: String,
      unique: true,
    },
    isFestival: Boolean,
    isActive: Boolean,
    order: Number,
  }, { timestamps: true });

  // Define product schema
  const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    comparePrice: Number,
    brand: String,
    stock: Number,
    image: String,
    images: [String],
    ratings: Number,
    numReviews: Number,
    isFeatured: Boolean,
    isActive: Boolean,
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }, { timestamps: true });

  // Create models (or use existing ones)
  const User = mongoose.models.User || mongoose.model('User', userSchema);
  const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

  // Seed users
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('Seeding users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Shivom@123', salt);

    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      phone: '9876543210',
      role: 'admin',
    });
    console.log('Admin user created');
  } else {
    console.log(`Found ${userCount} existing users, skipping user creation`);
  }

  // Seed categories
  const categoryCount = await Category.countDocuments();
  console.log(`Found ${categoryCount} existing categories`);

  // Force seeding categories regardless of existing count
  console.log('Seeding categories...');

  // Delete existing categories to avoid duplicates
  if (categoryCount > 0) {
    console.log('Deleting existing categories...');
    await Category.deleteMany({});
    console.log('Existing categories deleted');
  }
  const categories = await Category.insertMany([
    {
      name: 'Religious Books',
      description: 'Sacred texts and religious literature',
      image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/religious-books',
      slug: 'religious-books',
      isFestival: false,
      isActive: true,
      order: 1,
    },
    {
      name: 'Pooja Items',
      description: 'Essential items for religious ceremonies',
      image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/pooja-items',
      slug: 'pooja-items',
      isFestival: false,
      isActive: true,
      order: 2,
    },
    {
      name: 'Idols & Statues',
      description: 'Authentic and traditionally crafted religious idols',
      image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/idols',
      slug: 'idols-statues',
      isFestival: false,
      isActive: true,
      order: 3,
    },
    {
      name: 'Diwali',
      description: 'Products for the festival of lights',
      image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/diwali',
      slug: 'diwali',
      isFestival: true,
      isActive: true,
      order: 4,
    },
    {
      name: 'Holi',
      description: 'Products for the festival of colors',
      image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/holi',
      slug: 'holi',
      isFestival: true,
      isActive: true,
      order: 5,
    },
    {
      name: 'Navratri',
      description: 'Products for the nine-night festival',
      image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/navratri',
      slug: 'navratri',
      isFestival: true,
      isActive: true,
      order: 6,
    },
  ]);
  console.log('Categories created');

  // Seed products
  const productCount = await Product.countDocuments();
  console.log(`Found ${productCount} existing products`);

  // Force seeding products regardless of existing count
  console.log('Seeding products...');

  // Delete existing products to avoid duplicates
  if (productCount > 0) {
    console.log('Deleting existing products...');
    await Product.deleteMany({});
    console.log('Existing products deleted');
  }

  // Get admin user
  const adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    console.log('No admin user found. Cannot seed products.');
    return;
  }

  // Create products
  await Product.insertMany([
    {
      name: 'Brass Puja Thali Set',
      description: 'Complete brass puja thali set with all essential items for daily rituals.',
      price: 1299,
      comparePrice: 1599,
      brand: 'Devotional Crafts',
      stock: 25,
      image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/puja-thali',
      images: ['https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/puja-thali'],
      ratings: 4.8,
      numReviews: 124,
      isFeatured: true,
      isActive: true,
      slug: 'brass-puja-thali-set',
      category: categories[1]._id, // Pooja Items
      user: adminUser._id,
    },
    {
      name: 'Sandalwood Incense Sticks',
      description: 'Premium quality sandalwood incense sticks for a calming and spiritual atmosphere.',
      price: 199,
      comparePrice: 249,
      brand: 'Fragrant Devotion',
      stock: 100,
      image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/incense',
      images: ['https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/incense'],
      ratings: 4.6,
      numReviews: 89,
      isFeatured: true,
      isActive: true,
      slug: 'sandalwood-incense-sticks',
      category: categories[1]._id, // Pooja Items
      user: adminUser._id,
    },
    {
      name: 'Silver Lakshmi Ganesh Idol',
      description: 'Beautifully crafted silver-plated Lakshmi Ganesh idol for prosperity and good fortune.',
      price: 2499,
      comparePrice: 2999,
      brand: 'Divine Sculptures',
      stock: 15,
      image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/idol',
      images: ['https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/idol'],
      ratings: 4.9,
      numReviews: 56,
      isFeatured: true,
      isActive: true,
      slug: 'silver-lakshmi-ganesh-idol',
      category: categories[2]._id, // Idols & Statues
      user: adminUser._id,
    },
    {
      name: 'Handcrafted Diya Set',
      description: 'Set of 5 beautifully handcrafted clay diyas for festivals and special occasions.',
      price: 599,
      comparePrice: 799,
      brand: 'Artisan Creations',
      stock: 50,
      image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/diya',
      images: ['https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/diya'],
      ratings: 4.7,
      numReviews: 112,
      isFeatured: true,
      isActive: true,
      slug: 'handcrafted-diya-set',
      category: categories[3]._id, // Diwali
      user: adminUser._id,
    },
    {
      name: 'Bhagavad Gita - Hardcover',
      description: 'Beautifully bound hardcover edition of the Bhagavad Gita with original Sanskrit text and English translation.',
      price: 499,
      comparePrice: 599,
      brand: 'Sacred Texts',
      stock: 30,
      image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/bhagavad-gita',
      images: ['https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/bhagavad-gita'],
      ratings: 4.9,
      numReviews: 78,
      isFeatured: false,
      isActive: true,
      slug: 'bhagavad-gita-hardcover',
      category: categories[0]._id, // Religious Books
      user: adminUser._id,
    },
  ]);
  console.log('Products created');
}

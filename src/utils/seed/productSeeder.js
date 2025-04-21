import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import Category from '@/models/categoryModel';
import User from '@/models/userModel';

const products = [
  {
    name: 'Brass Puja Thali Set',
    description: 'Complete brass puja thali set with all essential items for daily rituals.',
    price: 1299,
    comparePrice: 1599,
    brand: 'Devotional Crafts',
    stock: 25,
    images: ['https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/puja-thali'],
    ratings: 4.8,
    numReviews: 124,
    isFeatured: true,
    isActive: true,
    specifications: [
      { name: 'Material', value: 'Brass' },
      { name: 'Items Included', value: '7 pieces' },
      { name: 'Diameter', value: '8 inches' }
    ],
    slug: 'brass-puja-thali-set'
  },
  {
    name: 'Sandalwood Incense Sticks',
    description: 'Premium quality sandalwood incense sticks for a calming and spiritual atmosphere.',
    price: 199,
    comparePrice: 249,
    brand: 'Fragrant Devotion',
    stock: 100,
    images: ['https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/incense'],
    ratings: 4.6,
    numReviews: 89,
    isFeatured: true,
    isActive: true,
    specifications: [
      { name: 'Quantity', value: '20 sticks' },
      { name: 'Fragrance', value: 'Sandalwood' },
      { name: 'Burning Time', value: '45 minutes per stick' }
    ],
    slug: 'sandalwood-incense-sticks'
  },
  {
    name: 'Silver Lakshmi Ganesh Idol',
    description: 'Beautifully crafted silver-plated Lakshmi Ganesh idol for prosperity and good fortune.',
    price: 2499,
    comparePrice: 2999,
    brand: 'Divine Sculptures',
    stock: 15,
    images: ['https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/idol'],
    ratings: 4.9,
    numReviews: 56,
    isFeatured: true,
    isActive: true,
    specifications: [
      { name: 'Material', value: 'Silver-plated metal' },
      { name: 'Height', value: '6 inches' },
      { name: 'Weight', value: '500g' }
    ],
    slug: 'silver-lakshmi-ganesh-idol'
  },
  {
    name: 'Handcrafted Diya Set',
    description: 'Set of 5 beautifully handcrafted clay diyas for festivals and special occasions.',
    price: 599,
    comparePrice: 799,
    brand: 'Artisan Creations',
    stock: 50,
    images: ['https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/diya'],
    ratings: 4.7,
    numReviews: 112,
    isFeatured: true,
    isActive: true,
    specifications: [
      { name: 'Material', value: 'Clay' },
      { name: 'Quantity', value: '5 pieces' },
      { name: 'Handpainted', value: 'Yes' }
    ],
    slug: 'handcrafted-diya-set'
  },
  {
    name: 'Bhagavad Gita - Hardcover',
    description: 'Beautifully bound hardcover edition of the Bhagavad Gita with original Sanskrit text and English translation.',
    price: 499,
    comparePrice: 599,
    brand: 'Sacred Texts',
    stock: 30,
    images: ['https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/products/bhagavad-gita'],
    ratings: 4.9,
    numReviews: 78,
    isFeatured: false,
    isActive: true,
    specifications: [
      { name: 'Language', value: 'Sanskrit with English translation' },
      { name: 'Pages', value: '420' },
      { name: 'Binding', value: 'Hardcover' }
    ],
    slug: 'bhagavad-gita-hardcover'
  }
];

export const seedProducts = async () => {
  try {
    await dbConnect();

    // Check if products already exist
    const count = await Product.countDocuments();

    if (count === 0) {
      console.log('Seeding products...');

      // Get admin user
      const adminUser = await User.findOne({ isAdmin: true });

      if (!adminUser) {
        console.log('No admin user found. Please seed users first.');
        return;
      }

      // Get categories
      const categories = await Category.find();

      if (categories.length === 0) {
        console.log('No categories found. Please seed categories first.');
        return;
      }

      // Assign categories to products
      const productsWithCategories = products.map((product, index) => {
        // Assign different categories to products
        const categoryIndex = index % categories.length;
        return {
          ...product,
          user: adminUser._id,
          category: categories[categoryIndex]._id
        };
      });

      await Product.insertMany(productsWithCategories);
      console.log('Products seeded successfully!');
    } else {
      console.log('Products already exist, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

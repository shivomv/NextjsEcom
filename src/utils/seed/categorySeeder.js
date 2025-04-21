import dbConnect from '@/utils/db';
import Category from '@/models/categoryModel';

const categories = [
  {
    name: 'Religious Books',
    description: 'Sacred texts and religious literature',
    image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/religious-books',
    parent: null,
    isFestival: false,
    isActive: true,
    order: 1,
  },
  {
    name: 'Pooja Items',
    description: 'Essential items for religious ceremonies',
    image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/pooja-items',
    parent: null,
    isFestival: false,
    isActive: true,
    order: 2,
  },
  {
    name: 'Idols & Statues',
    description: 'Authentic and traditionally crafted religious idols',
    image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/idols',
    parent: null,
    isFestival: false,
    isActive: true,
    order: 3,
  },
  {
    name: 'Diwali',
    description: 'Products for the festival of lights',
    image: 'https://res.cloudinary.com/djv7pwnju/image/upload/v1/my-shop/categories/diwali',
    parent: null,
    isFestival: true,
    isActive: true,
    order: 4,
  },
];

export const seedCategories = async () => {
  try {
    await dbConnect();
    
    // Check if categories already exist
    const count = await Category.countDocuments();
    
    if (count === 0) {
      console.log('Seeding categories...');
      await Category.insertMany(categories);
      console.log('Categories seeded successfully!');
    } else {
      console.log('Categories already exist, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

// Run the seeder if this file is executed directly
if (process.argv[1] === __filename) {
  seedCategories()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

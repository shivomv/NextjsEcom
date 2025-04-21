import { seedCategories } from './categorySeeder';
import { seedProducts } from './productSeeder';
import { seedUsers } from './userSeeder';

export const seedDatabase = async () => {
  try {
    // Seed users first (needed for products)
    await seedUsers();

    // Seed categories
    await seedCategories();

    // Seed products
    await seedProducts();

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seeder if this file is executed directly
if (process.argv[1] === __filename) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

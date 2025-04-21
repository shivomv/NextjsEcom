// This file is used to run the seed script from the command line
// Usage: node -r esm src/utils/seed/run-seed.js

import { seedDatabase } from './index';

// Run the seed script
seedDatabase()
  .then(() => {
    console.log('Seed script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running seed script:', error);
    process.exit(1);
  });

// Script to clean the database by removing all data from collections
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
console.log('Connecting to MongoDB:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    return cleanDatabase();
  })
  .then(() => {
    console.log('Database cleaning completed');
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

async function cleanDatabase() {
  // Get all collection names
  const collections = await mongoose.connection.db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  console.log('Found collections:', collectionNames);
  
  // Drop each collection
  for (const collectionName of collectionNames) {
    // Skip system collections
    if (collectionName.startsWith('system.')) {
      console.log(`Skipping system collection: ${collectionName}`);
      continue;
    }
    
    console.log(`Dropping collection: ${collectionName}`);
    try {
      await mongoose.connection.db.dropCollection(collectionName);
      console.log(`Collection ${collectionName} dropped successfully`);
    } catch (error) {
      console.error(`Error dropping collection ${collectionName}:`, error.message);
    }
  }
  
  console.log('All collections have been dropped');
}

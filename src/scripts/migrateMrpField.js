import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function migrateMrpField() {
  try {
    console.log('Starting MRP field migration...');
    
    // Find all products that have comparePrice field
    const products = await Product.find({ comparePrice: { $exists: true } });
    
    console.log(`Found ${products.length} products with comparePrice field`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      // If mrp is not set or is 0, use comparePrice
      if (!product.mrp || product.mrp === 0) {
        product.mrp = product.comparePrice;
        console.log(`Setting mrp to ${product.comparePrice} for product ${product.name} (${product._id})`);
      } else if (product.mrp !== product.comparePrice) {
        console.log(`Product ${product.name} (${product._id}) has different values: mrp=${product.mrp}, comparePrice=${product.comparePrice}`);
        console.log(`Using the higher value between mrp and comparePrice`);
        product.mrp = Math.max(product.mrp, product.comparePrice);
      }
      
      // Remove the comparePrice field
      product.comparePrice = undefined;
      
      // Save the product
      await product.save();
      updatedCount++;
      
      console.log(`Updated product ${product.name} (${product._id})`);
    }
    
    console.log(`Migration completed. Updated ${updatedCount} products.`);
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateMrpField();

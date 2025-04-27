import dbConnect from '../utils/db';
import Product from '../models/productModel';

/**
 * Migration script to consolidate stock fields
 * This script will:
 * 1. Copy countInStock to stock if stock is missing or 0
 * 2. Remove the countInStock field from all products
 */
async function migrateStockField() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');

    // Find all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to migrate`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Process each product
    for (const product of products) {
      const productData = product.toObject();
      
      // Check if we need to update the stock field
      if (productData.countInStock !== undefined) {
        // If stock is missing or 0 but countInStock has a value, use countInStock
        if (productData.stock === undefined || (productData.stock === 0 && productData.countInStock > 0)) {
          product.stock = productData.countInStock;
          console.log(`Updating product ${product.name}: Setting stock to ${productData.countInStock}`);
        } else {
          console.log(`Product ${product.name}: Already has stock value of ${productData.stock}, keeping it`);
        }
        
        // Remove the countInStock field
        product.set('countInStock', undefined, { strict: false });
        
        // Save the updated product
        await product.save();
        updatedCount++;
      } else {
        console.log(`Skipping product ${product.name}: No countInStock field`);
        skippedCount++;
      }
    }

    console.log(`Migration complete: Updated ${updatedCount} products, skipped ${skippedCount} products`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateStockField();

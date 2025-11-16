#!/usr/bin/env node
import Product from '../src/models/productModel.js';
import mongoose from 'mongoose';
import process from 'process';

function usage() {
  console.log(`Usage:
  node scripts/fix-missing-product-user.mjs [--dry-run] [--limit=N] [--apply --user=<USER_ID>]

Options:
  --dry-run     (default) show affected products without changing DB
  --apply       Actually set product.user to the provided --user value
  --user=ID     Required when using --apply. The user id (ObjectId) to set as owner
  --limit=N     Limit number of products to process (default 100)

Examples:
  node scripts/fix-missing-product-user.mjs --dry-run --limit=50
  node scripts/fix-missing-product-user.mjs --apply --user=68012aee84908fe473679930 --limit=100
`);
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    usage();
    process.exit(0);
  }

  const apply = argv.includes('--apply');
  const dryRun = !apply;
  const limitArg = argv.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 100;
  const userArg = argv.find(a => a.startsWith('--user='));
  const userId = userArg ? userArg.split('=')[1] : null;

  if (apply && !userId) {
    console.error('--apply requires --user=<USER_ID> to be specified');
    usage();
    process.exit(1);
  }

  console.log(`Connecting to DB...`);
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('Environment variable MONGODB_URI is not set. Set it before running the script.');
    usage();
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, bufferCommands: false });
    console.log('MongoDB connected');
  } catch (e) {
    console.error('Failed to connect to MongoDB:', e);
    process.exit(1);
  }

  const filter = { $or: [ { user: { $exists: false } }, { user: null } ] };
  const count = await Product.countDocuments(filter);
  console.log(`Found ${count} products with missing user field.`);

  if (count === 0) {
    process.exit(0);
  }

  const products = await Product.find(filter).limit(limit).select('_id name slug');

  console.log(`Previewing up to ${products.length} products:`);
  products.forEach((p, i) => {
    console.log(`${i + 1}. _id=${p._id} name=${p.name || '<no-name>'} slug=${p.slug || '<no-slug>'}`);
  });

  if (dryRun) {
    console.log('\nDry run complete. No changes were made.');
    process.exit(0);
  }

  // Apply mode
  console.log('\nApply mode: updating products...');
  const ownerObjectId = new mongoose.Types.ObjectId(userId);
  let updated = 0;
  for (const p of products) {
    try {
      p.user = ownerObjectId;
      await p.save();
      updated++;
      console.log(`Updated product ${p._id}`);
    } catch (e) {
      console.error(`Failed to update product ${p._id}:`, e);
    }
  }

  console.log(`Finished. Updated ${updated} products (attempted ${products.length}).`);
  if (count > products.length) {
    console.log(`Note: ${count - products.length} more products exist beyond the current limit. Rerun with --limit or process in batches.`);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error('Script failed:', e);
  process.exit(1);
});

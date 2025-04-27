// This file is used to run the migration script with proper Node.js environment
require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: [
    ['@babel/plugin-transform-modules-commonjs'],
    ['@babel/plugin-transform-runtime']
  ]
});

// Import and run the migration script
require('./migrateStockField.js');

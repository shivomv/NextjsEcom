import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Product from '@/models/productModel';
import Category from '@/models/categoryModel';
import { adminMiddleware } from '@/utils/auth';

export async function GET(request) {
  try {
    // Check if admin
    const adminResult = await adminMiddleware(request);
    if (adminResult.status) {
      return adminResult;
    }

    await dbConnect();

    // Get counts
    const count = await Product.countDocuments();
    const activeCount = await Product.countDocuments({ isActive: true });
    const inactiveCount = await Product.countDocuments({ isActive: false });
    const lowStockCount = await Product.countDocuments({ countInStock: { $lt: 10 } });
    const featuredCount = await Product.countDocuments({ isFeatured: true });

    // Get products by category
    const categories = await Category.find().select('_id name slug');
    const byCategory = [];

    // For each category, get product counts
    for (const category of categories) {
      const categoryCount = await Product.countDocuments({ category: category._id });
      const categoryActiveCount = await Product.countDocuments({
        category: category._id,
        isActive: true
      });
      const categoryInactiveCount = await Product.countDocuments({
        category: category._id,
        isActive: false
      });

      if (categoryCount > 0) {
        byCategory.push({
          _id: category._id,
          name: category.name,
          slug: category.slug,
          count: categoryCount,
          activeCount: categoryActiveCount,
          inactiveCount: categoryInactiveCount
        });
      }
    }

    return NextResponse.json({
      count,
      activeCount,
      inactiveCount,
      lowStockCount,
      featuredCount,
      byCategory
    });
  } catch (error) {
    console.error('Error fetching product count:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

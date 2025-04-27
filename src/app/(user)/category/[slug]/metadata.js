import dbConnect from '@/utils/db';
import Category from '@/models/categoryModel';

export async function generateMetadata({ params }) {
  const { slug } = params;

  // Default category data if the slug doesn't match any category
  const defaultCategory = {
    name: 'Products',
    description: 'Explore our collection of spiritual and religious products',
  };

  // Try to fetch the real category data
  try {
    await dbConnect();
    const categoryData = await Category.findOne({ slug });

    if (categoryData) {
      return {
        title: `${categoryData.name} | Prashasak Samiti`,
        description: categoryData.description,
      };
    }
  } catch (error) {
    console.error('Error fetching category metadata:', error);
  }

  // Fallback to default if category not found or error occurs
  return {
    title: `${defaultCategory.name} | Prashasak Samiti`,
    description: defaultCategory.description,
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

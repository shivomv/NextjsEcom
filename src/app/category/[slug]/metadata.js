export const generateMetadata = ({ params }) => {
  const { slug } = params;
  
  // Mock category data - in a real app, this would come from an API
  const categoryData = {
    idols: {
      name: 'Religious Idols',
      description: 'Authentic and traditionally crafted religious idols made with pure materials',
    },
    'cow-products': {
      name: 'Cow Products',
      description: 'Pure and authentic cow products made from indigenous cow breeds',
    },
    diwali: {
      name: 'Diwali Special',
      description: 'Traditional and eco-friendly products for the festival of lights',
    },
    gifts: {
      name: 'Spiritual Gifts',
      description: 'Meaningful spiritual gifts for all occasions',
    },
  };

  // Default category data if the slug doesn't match any category
  const defaultCategory = {
    name: 'Products',
    description: 'Explore our collection of spiritual and religious products',
  };

  // Get the category data based on the slug
  const category = categoryData[slug] || defaultCategory;

  return {
    title: `${category.name} | Prashasak Samiti`,
    description: category.description,
  };
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import Link from 'next/link';
import ImageWithFallback from '@/components/common/ImageWithFallback';

// This is a dynamic page that will display products based on the category slug
export default function CategoryPage({ params }) {
  const { slug } = params;

  // Mock category data - in a real app, this would come from an API
  const categoryData = {
    idols: {
      name: 'Religious Idols',
      description: 'Authentic and traditionally crafted religious idols made with pure materials',
      image: '/images/categories/idols-banner.jpg',
      products: [
        {
          id: 1,
          name: 'Brass Ganesh Idol',
          price: 1299,
          image: '/images/products/ganesh-idol.jpg',
          rating: 4.8,
          reviews: 124,
          slug: 'brass-ganesh-idol',
        },
        {
          id: 2,
          name: 'Marble Lakshmi Statue',
          price: 2499,
          image: '/images/products/lakshmi-statue.jpg',
          rating: 4.9,
          reviews: 86,
          slug: 'marble-lakshmi-statue',
        },
        {
          id: 3,
          name: 'Panchaloka Shiva Idol',
          price: 3999,
          image: '/images/products/shiva-idol.jpg',
          rating: 4.7,
          reviews: 92,
          slug: 'panchaloka-shiva-idol',
        },
        {
          id: 4,
          name: 'Brass Krishna Idol',
          price: 1899,
          image: '/images/products/krishna-idol.jpg',
          rating: 4.6,
          reviews: 78,
          slug: 'brass-krishna-idol',
        },
        {
          id: 5,
          name: 'Silver Plated Durga Idol',
          price: 4299,
          image: '/images/products/durga-idol.jpg',
          rating: 4.9,
          reviews: 65,
          slug: 'silver-plated-durga-idol',
        },
        {
          id: 6,
          name: 'Wooden Hanuman Statue',
          price: 1599,
          image: '/images/products/hanuman-statue.jpg',
          rating: 4.5,
          reviews: 53,
          slug: 'wooden-hanuman-statue',
        },
      ],
    },
    'cow-products': {
      name: 'Cow Products',
      description: 'Pure and authentic cow products made from indigenous cow breeds',
      image: '/images/categories/cow-products-banner.jpg',
      products: [
        {
          id: 7,
          name: 'Pure Cow Ghee',
          price: 699,
          image: '/images/products/cow-ghee.jpg',
          rating: 4.9,
          reviews: 215,
          slug: 'pure-cow-ghee',
        },
        {
          id: 8,
          name: 'Cow Dung Cakes (Pack of 12)',
          price: 299,
          image: '/images/products/dung-cakes.jpg',
          rating: 4.7,
          reviews: 89,
          slug: 'cow-dung-cakes',
        },
        {
          id: 9,
          name: 'Panchagavya Set',
          price: 899,
          image: '/images/products/panchagavya.jpg',
          rating: 4.8,
          reviews: 76,
          slug: 'panchagavya-set',
        },
        {
          id: 10,
          name: 'Cow Urine Distillate',
          price: 399,
          image: '/images/products/cow-urine.jpg',
          rating: 4.6,
          reviews: 62,
          slug: 'cow-urine-distillate',
        },
        {
          id: 11,
          name: 'Cow Milk Soap',
          price: 199,
          image: '/images/products/cow-milk-soap.jpg',
          rating: 4.8,
          reviews: 124,
          slug: 'cow-milk-soap',
        },
        {
          id: 12,
          name: 'Cow Dung Incense Sticks',
          price: 149,
          image: '/images/products/dung-incense.jpg',
          rating: 4.5,
          reviews: 97,
          slug: 'cow-dung-incense',
        },
      ],
    },
    diwali: {
      name: 'Diwali Special',
      description: 'Traditional and eco-friendly products for the festival of lights',
      image: '/images/categories/diwali-banner.jpg',
      products: [
        {
          id: 13,
          name: 'Handmade Clay Diyas (Set of 12)',
          price: 349,
          image: '/images/products/clay-diyas.jpg',
          rating: 4.8,
          reviews: 186,
          slug: 'handmade-clay-diyas',
        },
        {
          id: 14,
          name: 'Brass Kuber Diya',
          price: 899,
          image: '/images/products/kuber-diya.jpg',
          rating: 4.9,
          reviews: 92,
          slug: 'brass-kuber-diya',
        },
        {
          id: 15,
          name: 'Rangoli Color Set',
          price: 299,
          image: '/images/products/rangoli-colors.jpg',
          rating: 4.7,
          reviews: 78,
          slug: 'rangoli-color-set',
        },
        {
          id: 16,
          name: 'Lakshmi-Ganesh Idol Set',
          price: 1999,
          image: '/images/products/lakshmi-ganesh-set.jpg',
          rating: 4.9,
          reviews: 124,
          slug: 'lakshmi-ganesh-set',
        },
        {
          id: 17,
          name: 'Decorative Door Hangings',
          price: 499,
          image: '/images/products/door-hangings.jpg',
          rating: 4.6,
          reviews: 67,
          slug: 'decorative-door-hangings',
        },
        {
          id: 18,
          name: 'Traditional Oil Lamp',
          price: 1299,
          image: '/images/products/oil-lamp.jpg',
          rating: 4.8,
          reviews: 85,
          slug: 'traditional-oil-lamp',
        },
      ],
    },
    gifts: {
      name: 'Spiritual Gifts',
      description: 'Meaningful spiritual gifts for all occasions',
      image: '/images/categories/gifts-banner.jpg',
      products: [
        {
          id: 19,
          name: 'Rudraksha Mala',
          price: 799,
          image: '/images/products/rudraksha-mala.jpg',
          rating: 4.8,
          reviews: 112,
          slug: 'rudraksha-mala',
        },
        {
          id: 20,
          name: 'Silver Om Pendant',
          price: 1299,
          image: '/images/products/om-pendant.jpg',
          rating: 4.9,
          reviews: 78,
          slug: 'silver-om-pendant',
        },
        {
          id: 21,
          name: 'Bhagavad Gita - Deluxe Edition',
          price: 899,
          image: '/images/products/bhagavad-gita.jpg',
          rating: 5.0,
          reviews: 156,
          slug: 'bhagavad-gita-deluxe',
        },
        {
          id: 22,
          name: 'Crystal Pyramid Set',
          price: 1499,
          image: '/images/products/crystal-pyramid.jpg',
          rating: 4.7,
          reviews: 64,
          slug: 'crystal-pyramid-set',
        },
        {
          id: 23,
          name: 'Meditation Cushion Set',
          price: 1299,
          image: '/images/products/meditation-cushion.jpg',
          rating: 4.6,
          reviews: 89,
          slug: 'meditation-cushion-set',
        },
        {
          id: 24,
          name: 'Brass Bell with Wooden Stand',
          price: 999,
          image: '/images/products/brass-bell.jpg',
          rating: 4.8,
          reviews: 72,
          slug: 'brass-bell-stand',
        },
      ],
    },
  };

  // Default category data if the slug doesn't match any category
  const defaultCategory = {
    name: 'Products',
    description: 'Explore our collection of spiritual and religious products',
    image: '/images/categories/default-banner.jpg',
    products: [],
  };

  // Get the category data based on the slug
  const category = categoryData[slug] || defaultCategory;

  // Generate metadata for the page
  const metadata = {
    title: `${category.name} | Prashasak Samiti`,
    description: category.description,
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80 z-10"></div>
        <div className="relative h-[40vh] min-h-[300px] max-h-[400px] w-full">
          <ImageWithFallback
            src={category.image}
            alt={category.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {category.name}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-full bg-gradient-purple-pink text-white font-medium">
              All Products
            </button>
            <button className="px-4 py-2 rounded-full bg-white text-text hover:bg-gray-100 transition-colors font-medium">
              New Arrivals
            </button>
            <button className="px-4 py-2 rounded-full bg-white text-text hover:bg-gray-100 transition-colors font-medium">
              Best Sellers
            </button>
            <button className="px-4 py-2 rounded-full bg-white text-text hover:bg-gray-100 transition-colors font-medium">
              Featured
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-light">Sort by:</span>
            <select className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {category.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/products/${product.slug}`} className="block relative h-64 w-full overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform hover:scale-110 duration-500"
                  />
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product.slug}`} className="block">
                    <h3 className="text-lg font-semibold mb-2 text-primary hover:text-primary-dark transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-text-light text-sm ml-1">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary">₹{product.price}</span>
                    <button className="bg-gradient-purple-pink text-white p-2 rounded-full hover:opacity-90 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">No Products Found</h3>
            <p className="text-text-light mb-6">
              We couldn&apos;t find any products in this category. Please check back later or explore other categories.
            </p>
            <Link href="/products" className="bg-gradient-purple-pink text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
              Browse All Products
            </Link>
          </div>
        )}

        {/* Pagination */}
        {category.products.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-text-light hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-purple-pink text-white">
                1
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-text-light hover:bg-gray-100 transition-colors">
                2
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-text-light hover:bg-gray-100 transition-colors">
                3
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-text-light hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

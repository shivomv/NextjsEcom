import Link from 'next/link';
import ImageWithFallback from '@/components/common/ImageWithFallback';

export default function BlogPage() {
  // Mock blog posts data
  const featuredPost = {
    id: 1,
    title: 'The Significance of Navratri: A 9-Day Spiritual Journey',
    excerpt: 'Explore the deep spiritual meaning behind the 9-day celebration of Navratri, the worship of Goddess Durga, and how each day represents a different aspect of divine feminine energy.',
    image: '/images/blog/navratri.jpg',
    category: 'Festivals',
    date: 'October 15, 2023',
    author: 'Ramesh Sharma',
    authorImage: '/images/team/founder.jpg',
    slug: 'significance-of-navratri',
  };

  const blogPosts = [
    {
      id: 2,
      title: 'Understanding the Five Elements (Panch Tattva) in Hindu Philosophy',
      excerpt: 'Dive into the concept of Panch Tattva (five elements) and how they form the building blocks of all creation according to ancient Hindu philosophy.',
      image: '/images/blog/panch-tattva.jpg',
      category: 'Spirituality',
      date: 'September 28, 2023',
      author: 'Priya Patel',
      authorImage: '/images/team/artisan-head.jpg',
      slug: 'understanding-panch-tattva',
    },
    {
      id: 3,
      title: 'The Art of Making Traditional Diyas: Preserving Ancient Craftsmanship',
      excerpt: 'Learn about the traditional methods of making clay diyas, the artisans behind this craft, and why these handmade lamps are superior to mass-produced alternatives.',
      image: '/images/blog/diya-making.jpg',
      category: 'Craftsmanship',
      date: 'September 15, 2023',
      author: 'Vikram Singh',
      authorImage: '/images/team/quality-manager.jpg',
      slug: 'traditional-diya-making',
    },
    {
      id: 4,
      title: 'Benefits of Cow Products in Daily Life: An Ayurvedic Perspective',
      excerpt: 'Discover how traditional cow products like ghee, cow dung, and cow urine have been used in Ayurvedic practices for centuries and their benefits in modern life.',
      image: '/images/blog/cow-products.jpg',
      category: 'Ayurveda',
      date: 'August 30, 2023',
      author: 'Dr. Ananya Desai',
      authorImage: '/images/team/customer-lead.jpg',
      slug: 'benefits-of-cow-products',
    },
    {
      id: 5,
      title: 'Diwali Decoration Ideas: Blending Tradition with Modern Aesthetics',
      excerpt: 'Get inspired with these beautiful Diwali decoration ideas that honor traditional elements while incorporating contemporary design principles.',
      image: '/images/blog/diwali-decor.jpg',
      category: 'Festivals',
      date: 'August 22, 2023',
      author: 'Priya Patel',
      authorImage: '/images/team/artisan-head.jpg',
      slug: 'diwali-decoration-ideas',
    },
    {
      id: 6,
      title: 'The Science Behind Temple Bells: Acoustics and Spiritual Vibrations',
      excerpt: 'Explore the scientific principles behind the design of traditional temple bells and how their sound creates beneficial vibrations for meditation and spiritual practices.',
      image: '/images/blog/temple-bells.jpg',
      category: 'Science & Spirituality',
      date: 'August 10, 2023',
      author: 'Vikram Singh',
      authorImage: '/images/team/quality-manager.jpg',
      slug: 'science-of-temple-bells',
    },
    {
      id: 7,
      title: 'Essential Puja Items: A Guide for Beginners',
      excerpt: 'A comprehensive guide for those new to Hindu rituals, explaining the essential items needed for a basic puja and their significance in the worship process.',
      image: '/images/blog/puja-guide.jpg',
      category: 'Rituals',
      date: 'July 25, 2023',
      author: 'Ramesh Sharma',
      authorImage: '/images/team/founder.jpg',
      slug: 'essential-puja-items-guide',
    },
  ];

  const categories = [
    'All Categories',
    'Festivals',
    'Spirituality',
    'Craftsmanship',
    'Ayurveda',
    'Rituals',
    'Science & Spirituality',
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80 z-10"></div>
        <div className="relative h-[40vh] min-h-[300px] max-h-[400px] w-full">
          <ImageWithFallback
            src="/images/blog-banner.jpg"
            alt="Prashasak Samiti Blog"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Our Blog
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow">
              Insights on spirituality, traditional practices, and cultural heritage
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  index === 0
                    ? 'bg-gradient-purple-pink text-white'
                    : 'bg-white text-text hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <ImageWithFallback
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-gradient-purple-pink text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md">
                  Featured
                </div>
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="text-text-light text-sm ml-3">{featuredPost.date}</span>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-primary hover:text-primary-dark transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-text-light mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden relative mr-3">
                      <ImageWithFallback
                        src={featuredPost.authorImage}
                        alt={featuredPost.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium">{featuredPost.author}</span>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="text-primary hover:text-primary-dark font-medium flex items-center transition-colors"
                  >
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <p className="text-text-light text-sm mb-2">{post.date}</p>
                <h3 className="text-xl font-bold mb-3 text-primary hover:text-primary-dark transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-text-light mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative mr-2">
                      <ImageWithFallback
                        src={post.authorImage}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">{post.author}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary hover:text-primary-dark text-sm font-medium flex items-center transition-colors"
                  >
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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
            <span className="text-text-light">...</span>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-text-light hover:bg-gray-100 transition-colors">
              8
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 text-text-light hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-gradient-purple-pink text-white rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h2 className="text-2xl font-bold mb-2">Subscribe to Our Blog</h2>
              <p className="text-white/90">
                Get the latest articles, festival guides, and spiritual insights delivered directly to your inbox.
              </p>
            </div>
            <div className="md:w-1/2">
              <form className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none text-text text-base"
                />
                <button
                  type="submit"
                  className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md sm:rounded-l-none sm:rounded-r-md font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-white/80 text-sm mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

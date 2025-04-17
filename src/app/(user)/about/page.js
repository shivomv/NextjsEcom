import Link from 'next/link';
import ImageWithFallback from '@/components/common/ImageWithFallback';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80 z-10"></div>
        <div className="relative h-[40vh] min-h-[300px] max-h-[400px] w-full">
          <ImageWithFallback
            src="/images/about-banner.jpg"
            alt="About Prashasak Samiti"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              About Us
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow">
              Preserving tradition, spirituality, and cultural heritage through authentic products
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Our Story Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-primary">Our Story</h2>
              <div className="prose max-w-none">
                <p className="mb-4">
                  Prashasak Samiti was founded in 2010 with a vision to preserve and promote India&apos;s rich spiritual and cultural heritage. What began as a small initiative to support local artisans creating traditional puja items has now grown into a trusted name for authentic spiritual products across India.
                </p>
                <p className="mb-4">
                  Our journey started when our founder, Shri Ramesh Sharma, noticed the declining quality of religious items in the market and the struggles faced by traditional craftsmen. With a deep respect for ancient traditions and a commitment to authenticity, he brought together a team of dedicated individuals who shared his passion.
                </p>
                <p>
                  Today, we work directly with over 200 artisan families across India, ensuring that traditional craftsmanship is preserved while providing these skilled craftspeople with fair compensation and sustainable livelihoods.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/about-story.jpg"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mb-16 bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-purple-pink rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Preserve Tradition</h3>
              <p className="text-text-light text-center">
                We are committed to preserving ancient traditions and craftsmanship by working with skilled artisans who create products using time-honored techniques.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-purple-pink rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Ensure Authenticity</h3>
              <p className="text-text-light text-center">
                We guarantee that all our products are made with authentic materials and methods, adhering to traditional specifications and spiritual guidelines.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-purple-pink rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Support Artisans</h3>
              <p className="text-text-light text-center">
                We provide fair compensation and sustainable livelihoods to traditional artisans, helping preserve their craft and supporting their communities.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-purple-pink rounded-full flex items-center justify-center">
                <span className="text-xl text-white">🙏</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Respect for Tradition</h3>
                <p className="text-text-light">
                  We deeply respect ancient traditions and strive to maintain the integrity of spiritual practices in all our products and services.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-purple-pink rounded-full flex items-center justify-center">
                <span className="text-xl text-white">✨</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Quality & Purity</h3>
                <p className="text-text-light">
                  We never compromise on the quality and purity of our products, ensuring they meet the highest standards for spiritual use.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-purple-pink rounded-full flex items-center justify-center">
                <span className="text-xl text-white">🤝</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Community Support</h3>
                <p className="text-text-light">
                  We believe in supporting the communities that preserve our cultural heritage, from artisans to spiritual practitioners.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-purple-pink rounded-full flex items-center justify-center">
                <span className="text-xl text-white">🌱</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Sustainability</h3>
                <p className="text-text-light">
                  We are committed to environmentally sustainable practices, using eco-friendly materials and processes whenever possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Ramesh Sharma',
                position: 'Founder & CEO',
                image: '/images/team/founder.jpg',
              },
              {
                name: 'Priya Patel',
                position: 'Head of Artisan Relations',
                image: '/images/team/artisan-head.jpg',
              },
              {
                name: 'Vikram Singh',
                position: 'Product Quality Manager',
                image: '/images/team/quality-manager.jpg',
              },
              {
                name: 'Ananya Desai',
                position: 'Customer Experience Lead',
                image: '/images/team/customer-lead.jpg',
              },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64 w-full">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-text-light">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-purple-pink text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Experience the richness of Indian spiritual traditions with our authentic products. Connect with us to learn more about our mission and how you can be a part of preserving our cultural heritage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors">
              Explore Our Products
            </Link>
            <Link href="/contact" className="bg-transparent hover:bg-white/10 border-2 border-white px-6 py-3 rounded-full font-medium transition-colors">
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { productAPI } from '@/services/api';
import { useCart } from '@/context/CartContext';
import Breadcrumb from '@/components/common/Breadcrumb';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductCard from '@/components/products/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const productData = await productAPI.getProductBySlug(slug);
        setProduct(productData);

        // Fetch related products
        if (productData._id) {
          const relatedData = await productAPI.getRelatedProducts(productData._id);
          setRelatedProducts(relatedData);
        }
      } catch (error) {
        setError(error.toString());
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      setIsAddingToCart(true);
      addToCart(product, quantity);

      // Reset button state after animation
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
    }
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ];

  if (product) {
    if (product.category) {
      breadcrumbItems.push({
        label: product.category.name,
        href: `/products?category=${product.category.slug}`,
      });
    }
    breadcrumbItems.push({
      label: product.name,
      href: `/products/${product.slug}`,
      active: true,
    });
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <p>Error loading product: {error}</p>
          <Link href="/products" className="text-primary hover:underline mt-2 inline-block">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md">
          <p>Product not found.</p>
          <Link href="/products" className="text-primary hover:underline mt-2 inline-block">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row -mx-4">
            {/* Product Images */}
            <div className="md:w-1/2 px-4 mb-6 md:mb-0">
              <div className="relative h-64 sm:h-80 md:h-96 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={product.images[activeImage]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                        activeImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 px-4">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.hindiName}</p>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice > 0 && product.comparePrice > product.price && (
                  <>
                    <span className="text-lg text-gray-500 line-through ml-2">
                      {formatPrice(product.comparePrice)}
                    </span>
                    <span className="ml-2 bg-primary text-white text-sm px-2 py-1 rounded">
                      {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Rating */}
              {product.ratings > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill={i < Math.floor(product.ratings) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    {product.ratings.toFixed(1)} ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-4">
                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0
                    ? `In Stock (${product.stock} available)`
                    : 'Out of Stock'}
                </span>
              </div>

              {/* Category */}
              {product.category && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Category: </span>
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {product.category.name}
                  </Link>
                </div>
              )}

              {/* Short Description */}
              <div className="mb-6">
                <p className="text-gray-700">
                  {product.description.length > 200
                    ? `${product.description.substring(0, 200)}...`
                    : product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <div className="flex">
                    <button
                      onClick={decrementQuantity}
                      className="bg-gray-200 px-3 py-2 rounded-l-md hover:bg-gray-300"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 text-center border-t border-b border-gray-300 py-2"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAddingToCart}
                  className={`${
                    product.stock <= 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : isAddingToCart
                        ? 'bg-green-500'
                        : 'bg-primary hover:bg-primary-dark'
                  } text-white px-6 py-3 rounded-md transition-colors flex-1 flex items-center justify-center`}
                >
                  {product.stock <= 0 ? (
                    'Out of Stock'
                  ) : isAddingToCart ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  className="border border-primary text-primary px-4 py-3 rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>

              {/* Delivery & Returns */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                  </svg>
                  <span className="text-sm">Free shipping on orders over ₹500</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"></path>
                  </svg>
                  <span className="text-sm">7-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'description'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              {product.spiritualSignificance && (
                <button
                  onClick={() => setActiveTab('spiritual')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'spiritual'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Spiritual Significance
                </button>
              )}
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews ({product.numReviews})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'shipping'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Shipping & Returns
              </button>
            </nav>
          </div>

          <div className="p-4 md:p-6">
            {activeTab === 'description' && (
              <div>
                <h2 className="text-lg font-bold mb-4">Product Description</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{product.description}</p>
                </div>

                {/* Product Specifications */}
                {(product.materials?.length > 0 || product.dimensions || product.weight?.value) && (
                  <div className="mt-6">
                    <h3 className="text-md font-bold mb-3">Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.materials?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Materials</h4>
                          <p className="text-gray-600">{product.materials.join(', ')}</p>
                        </div>
                      )}

                      {product.dimensions && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Dimensions</h4>
                          <p className="text-gray-600">
                            {product.dimensions.length && product.dimensions.width && product.dimensions.height
                              ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} ${product.dimensions.unit || 'cm'}`
                              : 'Dimensions not specified'}
                          </p>
                        </div>
                      )}

                      {product.weight?.value && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Weight</h4>
                          <p className="text-gray-600">
                            {`${product.weight.value} ${product.weight.unit || 'g'}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'spiritual' && product.spiritualSignificance && (
              <div>
                <h2 className="text-lg font-bold mb-4">Spiritual Significance</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{product.spiritualSignificance}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-lg font-bold mb-4">Customer Reviews</h2>

                {product.numReviews === 0 ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>No reviews yet. Be the first to review this product.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* This would be populated with actual reviews from the API */}
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill={i < 5 ? 'currentColor' : 'none'}
                              stroke="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <h3 className="font-medium">Great product for daily puja</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        This product is excellent quality and perfect for my daily puja rituals. The craftsmanship is outstanding.
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>By Rajesh S.</span>
                        <span className="mx-2">•</span>
                        <span>Verified Purchase</span>
                        <span className="mx-2">•</span>
                        <span>2 months ago</span>
                      </div>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill={i < 4 ? 'currentColor' : 'none'}
                              stroke="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <h3 className="font-medium">Good quality, fast delivery</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        The product arrived quickly and was well packaged. The quality is good for the price.
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>By Priya P.</span>
                        <span className="mx-2">•</span>
                        <span>Verified Purchase</span>
                        <span className="mx-2">•</span>
                        <span>1 month ago</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <Link
                    href={`/products/${product.slug}/reviews`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Write a Review
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h2 className="text-lg font-bold mb-4">Shipping & Returns</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">Shipping Information</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>Free shipping on orders above ₹500</li>
                      <li>Standard shipping: 3-5 business days</li>
                      <li>Express shipping: 1-2 business days (additional charges apply)</li>
                      <li>We ship to all major cities across India</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-2">Return Policy</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>Returns accepted within 7 days of delivery</li>
                      <li>Item must be unused and in original packaging</li>
                      <li>Contact our customer service team to initiate a return</li>
                      <li>Refunds will be processed within 5-7 business days after receiving the returned item</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

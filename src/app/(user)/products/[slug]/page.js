"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { productAPI } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Breadcrumb from "@/components/common/Breadcrumb";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ProductCard from "@/components/products/ProductCard";
import ProductDetailSkeleton from "@/components/common/ProductDetailSkeleton";
import StarRating from "@/components/common/StarRating";
import ReviewList from "@/components/products/ReviewList";
import ReviewForm from "@/components/products/ReviewForm";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        let productData;
        // Check if slug is a MongoDB ObjectId (24 hex characters)
        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
          productData = await productAPI.getProductById(slug);
        } else {
          productData = await productAPI.getProductBySlug(slug);
        }

        setProduct(productData);

        // Fetch related products
        if (productData._id) {
          const relatedData = await productAPI.getRelatedProducts(
            productData._id
          );
          setRelatedProducts(relatedData);
        }
      } catch (error) {
        setError(error.toString());
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Check if the user has already reviewed this product
  useEffect(() => {
    const checkUserReview = async () => {
      if (!isAuthenticated || !user || !product) {
        return;
      }

      try {
        const response = await fetch(
          `/api/products/${product._id}/user-review`
        );

        if (response.ok) {
          const data = await response.json();
          setHasUserReviewed(data.hasReviewed);
        }
      } catch (err) {
        console.error("Error checking user review:", err);
      }
    };

    checkUserReview();
  }, [isAuthenticated, user, product]);

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
    // Prevent adding out-of-stock items (stock is undefined, null, 0, or negative)
    if (
      !product ||
      product.stock === undefined ||
      product.stock === null ||
      product.stock <= 0
    ) {
      console.error("Cannot add out-of-stock product to cart:", product?.name);
      return;
    }

    if (quantity > 0) {
      setIsAddingToCart(true);
      const success = addToCart(product, quantity);

      // Reset button state after animation
      setTimeout(
        () => {
          setIsAddingToCart(false);
        },
        success ? 1000 : 300
      ); // Shorter animation if failed
    }
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
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
      href: `/products/${product._id}`,
      active: true,
    });
  }

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <p>Error loading product: {error}</p>
          <Link
            href="/products"
            className="text-primary hover:underline mt-2 inline-block"
          >
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
          <Link
            href="/products"
            className="text-primary hover:underline mt-2 inline-block"
          >
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
                        activeImage === index
                          ? "border-primary"
                          : "border-transparent"
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
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{product.hindiName}</p>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.mrp > 0 &&
                  product.mrp > product.price && (
                    <>
                      <span className="text-lg text-gray-500 line-through ml-2">
                        {formatPrice(product.mrp)}
                      </span>
                      <span className="ml-2 bg-primary text-white text-sm px-2 py-1 rounded">
                        {Math.round(
                          ((product.mrp - product.price) /
                            product.mrp) *
                            100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
              </div>

              {/* Rating */}
              {product.ratings > 0 && product.numReviews > 0 && (
                <div className="mb-4">
                  <StarRating
                    rating={product.ratings}
                    size="lg"
                    color="text-yellow-400"
                    showCount={true}
                    count={product.numReviews}
                  />
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-sm text-white bg-red-600 px-3 py-1 rounded-full font-bold">
                    OUT OF STOCK
                  </span>
                )}

                {/* Low stock warning */}
                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-sm text-amber-600 mt-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Only {product.stock} left in stock - order soon!
                  </p>
                )}
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
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                {product.stock <= 0 ? (
                  <button
                    disabled
                    className="bg-red-100 border-2 border-red-600 text-red-600 px-6 py-3 rounded-md flex-1 flex items-center justify-center cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    OUT OF STOCK
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`${
                      isAddingToCart
                        ? "bg-green-500"
                        : "bg-primary hover:bg-primary-dark"
                    } text-white px-6 py-3 rounded-md transition-colors flex-1 flex items-center justify-center`}
                  >
                    {isAddingToCart ? (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          ></path>
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                )}

                <button className="hidden sm:block border border-primary text-primary px-4 py-3 rounded-md hover:bg-primary hover:text-white transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Delivery & Returns */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 text-primary mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    ></path>
                  </svg>
                  <span className="text-sm">
                    Free shipping on orders over ₹500
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-primary mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                    ></path>
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
                onClick={() => setActiveTab("description")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "description"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
              </button>
              {product.spiritualSignificance && (
                <button
                  onClick={() => setActiveTab("spiritual")}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === "spiritual"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Spiritual Significance
                </button>
              )}
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "reviews"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews ({product.numReviews})
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "shipping"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Shipping & Returns
              </button>
            </nav>
          </div>

          <div className="p-4 md:p-6">
            {activeTab === "description" && (
              <div>
                <h2 className="text-lg font-bold mb-4">Product Description</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{product.description}</p>
                </div>

                {/* Product Properties */}
                {product.specifications?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-md font-bold mb-3">Properties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-sm">
                      {product.specifications.map((specification, index) => (
                        <div key={index}>
                          <h4 className="font-medium text-gray-700 capitalize">
                            {specification.name}
                          </h4>
                          <p className="text-gray-600">{specification.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "spiritual" && product.spiritualSignificance && (
              <div>
                <h2 className="text-lg font-bold mb-4">
                  Spiritual Significance
                </h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">
                    {product.spiritualSignificance}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="text-lg font-bold mb-4">Customer Reviews</h2>

                {/* Display reviews */}
                <ReviewList
                  productId={product._id}
                  onEditReview={(review) => {
                    setReviewToEdit(review);
                    setShowReviewForm(true);
                    // Scroll to review form
                    document
                      .getElementById("review-form")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                />

                {/* Write a Review section - only show if user hasn't already reviewed */}
                {isAuthenticated && !hasUserReviewed && !showReviewForm && (
                  <div className="mt-6 mb-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-dashed border-purple-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-gradient-purple-pink p-3 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            Share Your Experience
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Help other customers by sharing your thoughts about this product
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setReviewToEdit(null);
                            setShowReviewForm(true);
                            setTimeout(() => {
                              document
                                .getElementById("review-form")
                                ?.scrollIntoView({ behavior: "smooth", block: "center" });
                            }, 100);
                          }}
                          className="bg-gradient-purple-pink text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                          Write Your Review
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review form */}
                {showReviewForm && (
                  <div id="review-form" className="mt-6 scroll-mt-20">
                    <div className="relative">
                      {/* Close button for non-edit mode */}
                      {!reviewToEdit && (
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="absolute -top-2 -right-2 z-10 bg-white border-2 border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 rounded-full p-2 shadow-md hover:shadow-lg transition-all"
                          title="Close review form"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                      <ReviewForm
                        productId={product._id}
                        reviewToEdit={reviewToEdit}
                        initialShowForm={showReviewForm}
                        onReviewUpdated={(review) => {
                          // Clear the review being edited after update
                          setReviewToEdit(null);
                          setShowReviewForm(false);

                          // Update the hasUserReviewed state
                          setHasUserReviewed(true);

                          // Refresh the reviews list
                          setTimeout(() => {
                            router.refresh();
                          }, 1000);
                        }}
                        onCancel={() => {
                          setReviewToEdit(null);
                          setShowReviewForm(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "shipping" && (
              <div>
                <h2 className="text-lg font-bold mb-4">Shipping & Returns</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">
                      Shipping Information
                    </h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>Free shipping on orders above ₹500</li>
                      <li>Standard shipping: 3-5 business days</li>
                      <li>
                        Express shipping: 1-2 business days (additional charges
                        apply)
                      </li>
                      <li>We ship to all major cities across India</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-2">Return Policy</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>Returns accepted within 7 days of delivery</li>
                      <li>Item must be unused and in original packaging</li>
                      <li>
                        Contact our customer service team to initiate a return
                      </li>
                      <li>
                        Refunds will be processed within 5-7 business days after
                        receiving the returned item
                      </li>
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
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

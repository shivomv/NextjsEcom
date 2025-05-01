"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import HeroSlider from "@/components/common/HeroSlider";
import { useCategories } from "@/context/CategoryContext";
import { useCart } from "@/context/CartContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ProductCard from "@/components/products/ProductCard";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const { parentCategories, loading: categoriesLoading } = useCategories();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [heroData, setHeroData] = useState({
    heroTitle: "Authentic Spiritual Products",
    heroSubtitle:
      "Discover our collection of traditional and authentic spiritual items crafted with devotion",
    heroButtonText: "Shop Now",
    heroButtonLink: "/products",
    heroImage: "/images/hero-banner.jpg",

    promoTitle: "Special Navratri Collection",
    promoSubtitle:
      "Exclusive discounts on all puja items and decorations for the festive season",
    promoButtonText: "Shop the Collection",
    promoButtonLink: "/products?category=navratri-collection",
    promoImage: "/images/promo-banner.jpg",
  });

  const [heroSlides, setHeroSlides] = useState([]);

  // Fetch hero section data
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // Fetch hero data
        const heroResponse = await fetch("/api/settings?tab=hero");
        if (heroResponse.ok) {
          const heroData = await heroResponse.json();
          console.log("Fetched hero data:", heroData);

          if (heroData && heroData.slides && Array.isArray(heroData.slides)) {
            console.log("Found hero slides:", heroData.slides);
            setHeroSlides(heroData.slides);
          }
        }

        // Fetch promo data
        const promoResponse = await fetch("/api/settings?tab=promo");
        if (promoResponse.ok) {
          const promoData = await promoResponse.json();
          console.log("Fetched promo data:", promoData);

          if (promoData) {
            setHeroData((prevData) => ({
              ...prevData,
              promoTitle: promoData.promoTitle || prevData.promoTitle,
              promoSubtitle: promoData.promoSubtitle || prevData.promoSubtitle,
              promoButtonText:
                promoData.promoButtonText || prevData.promoButtonText,
              promoButtonLink:
                promoData.promoButtonLink || prevData.promoButtonLink,
              promoImage: promoData.promoImage || prevData.promoImage,
            }));
          }
        }

        // No default slide - if no slides are found, the slider won't be shown
      } catch (error) {
        console.error("Error fetching hero section data:", error);
      }
    };

    fetchHeroData();
  }, []);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products/featured?limit=4");
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data || []);
        } else {
          console.error("Failed to fetch featured products:", response.status);
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Fetch recent products
  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setRecentLoading(true);
        const response = await fetch("/api/products/recent?limit=6");
        if (response.ok) {
          const data = await response.json();
          setRecentProducts(data || []);
        } else {
          console.error("Failed to fetch recent products:", response.status);
          setRecentProducts([]);
        }
      } catch (error) {
        console.error("Error fetching recent products:", error);
        setRecentProducts([]);
      } finally {
        setRecentLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* Hero Section */}
      <HeroSlider slides={heroSlides} />

      {/* Categories Section */}
      <section className="py-12 px-4 container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Shop by Category
          </h2>
          <div className="w-24 h-1 bg-gradient-purple-pink mx-auto rounded-full"></div>
        </div>

        {categoriesLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {parentCategories.map((category) => (
              <Link
                href={`/category/${category.slug}`}
                key={category._id || category.id}
                className="group relative overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="relative h-40 md:h-52 w-full">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>
                <h3 className="absolute bottom-3 left-0 right-0 text-center text-white font-bold text-lg z-20">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="py-12 px-4 container mx-auto bg-pattern-dots rounded-lg">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Featured Products
          </h2>
          <div className="w-24 h-1 bg-gradient-pink-orange mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No Featured Products Available
            </h3>
            <p className="text-gray-500 mb-6">
              Our featured products will be available soon.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center bg-gradient-purple-pink text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Browse All Products
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center bg-white hover:bg-gradient-purple-pink hover:text-white border-2 border-gradient-purple-pink text-gradient-purple-pink px-6 py-2 rounded-full font-medium transition-colors"
          >
            View All Products
            <ArrowLeftCircleIcon className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 px-4 container mx-auto">
        <div className="relative overflow-hidden rounded-lg">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-800/90 z-10"></div>

          {/* Image background */}
          <div className="relative h-[300px] w-full">
            <ImageWithFallback
              src={heroData.promoImage}
              alt="Special Offers"
              fill
              className="object-cover"
            />

            {/* Overlay content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                {heroData.promoTitle}
              </h2>
              <p className="text-lg text-white mb-6 max-w-2xl drop-shadow-md">
                {heroData.promoSubtitle}
              </p>

              {/* Gradient text button */}
              <Link
                href={heroData.promoButtonLink}
                className="bg-white px-8 py-3 rounded-full font-medium text-lg transition-all transform hover:scale-105 shadow-lg bg-gradient-to-l from-purple-900/90 to-pink-800/90 text-white hover:brightness-110"
              >
                {heroData.promoButtonText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Products Section */}
      <section className="py-12 px-4 container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Recently Added Products
            {!recentLoading && recentProducts.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500 align-middle">
                ({recentProducts.length})
              </span>
            )}
          </h2>
          <div className="w-24 h-1 bg-gradient-purple-pink mx-auto rounded-full"></div>
          <p className="mt-4 text-text-light max-w-2xl mx-auto">
            Discover our newest spiritual items, freshly added to our
            collection. These products are crafted with devotion and traditional
            techniques.
          </p>
        </div>

        {recentLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : recentProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {recentProducts.map((product) => (
              <ProductCard key={product._id} product={product} compact={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              New Products Coming Soon
            </h3>
            <p className="text-gray-500 mb-6">
              We're constantly adding new spiritual items to our collection.
            </p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/products?sort=newest"
            className="inline-flex items-center bg-white hover:bg-gradient-purple-pink hover:text-white border-2 border-gradient-purple-pink text-gradient-purple-pink px-6 py-2 rounded-full font-medium transition-colors"
          >
            View All New Products
            <ArrowLeftCircleIcon className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}

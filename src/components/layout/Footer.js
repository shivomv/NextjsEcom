'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCategories } from '@/context/CategoryContext';

export default function Footer() {
  const [expandedSection, setExpandedSection] = useState(null);
  const { parentCategories, festivalCategories, loading: categoriesLoading } = useCategories();

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  return (
    <footer className="bg-pattern-dots pt-12 pb-28 md:pb-8 text-text">
      <div className="container mx-auto px-4">
        {/* Newsletter Subscription */}
        <div className="bg-gradient-purple-pink rounded-lg p-4 sm:p-6 mb-8 sm:mb-12 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Subscribe for Updates
              </h3>
              <p className="text-white/90 text-sm sm:text-base">Get notified about new products and upcoming festivals</p>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3">
              <form className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none text-text text-base"
                />
                <button
                  type="submit"
                  className="bg-gradient-pink-orange text-white px-4 py-3 rounded-md sm:rounded-l-none sm:rounded-r-md hover:opacity-90 transition-opacity font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Mobile Accordion for Footer Sections */}
          {/* About */}
          <div className="border-b border-gray-200 pb-4 sm:border-0 sm:pb-0">
            <h4
              className="text-lg font-bold mb-4 flex justify-between items-center cursor-pointer sm:cursor-default"
              onClick={() => toggleSection('about')}
            >
              About Us
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform sm:hidden ${expandedSection === 'about' ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </h4>
            <div className={`${expandedSection === 'about' ? 'block' : 'hidden sm:block'}`}>
              <p className="mb-4 text-text-light">
                Prashasak Samiti is dedicated to providing authentic religious and spiritual products made with traditional methods and pure ingredients.
              </p>
              <div className="flex space-x-4">
              <a href="#" className="text-text-light hover:text-primary transition-colors" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
              <a href="#" className="text-text-light hover:text-primary transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="text-text-light hover:text-primary transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-b border-gray-200 pb-4 sm:border-0 sm:pb-0">
            <h4
              className="text-lg font-bold mb-4 flex justify-between items-center cursor-pointer sm:cursor-default"
              onClick={() => toggleSection('links')}
            >
              Quick Links
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform sm:hidden ${expandedSection === 'links' ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </h4>
            <div className={`${expandedSection === 'links' ? 'block' : 'hidden sm:block'}`}>
              <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-text-light hover:text-gradient-purple-pink transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-text-light hover:text-gradient-purple-pink transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Products
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-text-light hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-light hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text-light hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
            </div>
          </div>

          {/* Categories */}
          <div className="border-b border-gray-200 pb-4 sm:border-0 sm:pb-0">
            <h4
              className="text-lg font-bold mb-4 flex justify-between items-center cursor-pointer sm:cursor-default"
              onClick={() => toggleSection('categories')}
            >
              Categories
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform sm:hidden ${expandedSection === 'categories' ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </h4>
            <div className={`${expandedSection === 'categories' ? 'block' : 'hidden sm:block'}`}>
              <ul className="space-y-2">
                {!categoriesLoading ? (
                  // Display categories from database
                  parentCategories.map((category) => (
                    <li key={category._id}>
                      <Link href={`/category/${category.slug}`} className="text-text-light hover:text-primary transition-colors">
                        {category.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  // Fallback categories while loading
                  <>
                    <li>
                      <Link href="/category/puja-items" className="text-text-light hover:text-primary transition-colors">
                        Puja Items
                      </Link>
                    </li>
                    <li>
                      <Link href="/category/idols" className="text-text-light hover:text-primary transition-colors">
                        Idols & Statues
                      </Link>
                    </li>
                  </>
                )}

                {/* Festival categories */}
                {!categoriesLoading && festivalCategories.length > 0 && (
                  <li className="pt-2 border-t border-gray-200 mt-2">
                    <span className="text-text-light font-medium">Festivals:</span>
                    <ul className="pl-2 mt-1 space-y-1">
                      {festivalCategories.map((festival) => (
                        <li key={festival._id}>
                          <Link href={`/category/${festival.slug}`} className="text-text-light hover:text-primary transition-colors">
                            {festival.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="border-b border-gray-200 pb-4 sm:border-0 sm:pb-0">
            <h4
              className="text-lg font-bold mb-4 flex justify-between items-center cursor-pointer sm:cursor-default"
              onClick={() => toggleSection('contact')}
            >
              Contact Us
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform sm:hidden ${expandedSection === 'contact' ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </h4>
            <div className={`${expandedSection === 'contact' ? 'block' : 'hidden sm:block'}`}>
              <ul className="space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-gradient-purple-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-text-light">
                  123 Temple Street, Spiritual District, India
                </span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gradient-purple-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-text-light">+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gradient-purple-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-text-light">info@prashasaksamiti.com</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gradient-purple-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-text-light">Mon-Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-200 pt-8 pb-4">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="text-text-light">We accept:</span>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="bg-white p-3 rounded-full shadow-sm border border-primary/10 hover:border-primary/30 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="bg-white p-3 rounded-full shadow-sm border border-primary/10 hover:border-primary/30 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="bg-white p-3 rounded-full shadow-sm border border-primary/10 hover:border-primary/30 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="bg-white p-3 rounded-full shadow-sm border border-primary/10 hover:border-primary/30 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </span>
              <span className="bg-white p-3 rounded-full shadow-sm border border-primary/10 hover:border-primary/30 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </span>
              <span className="bg-white p-3 rounded-full shadow-sm border border-primary/10 hover:border-primary/30 transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gradient-purple-pink pt-6 text-center text-sm text-text-light">
          <p>&copy; {new Date().getFullYear()} Prashasak Samiti. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="hover:text-gradient-purple-pink transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gradient-purple-pink transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping" className="hover:text-gradient-purple-pink transition-colors">
              Shipping Policy
            </Link>
            <Link href="/refund" className="hover:text-gradient-purple-pink transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

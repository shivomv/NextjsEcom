'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCategories } from '@/context/CategoryContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [mobileFeaturedOpen, setMobileFeaturedOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const { categories, parentCategories, festivalCategories, loading: categoriesLoading } = useCategories();
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Toggle mobile search bar visibility
  const toggleMobileSearch = () => {
    setMobileSearchVisible(!mobileSearchVisible);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchVisible(false);
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((e) => {
    if (isProfileOpen && !e.target.closest('.profile-dropdown')) {
      setIsProfileOpen(false);
    }
  }, [isProfileOpen]);

  // Add event listener for clicks outside the dropdown
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-gradient-purple-pink">
      {/* Top bar with contact info and social links */}
      <div className="bg-gradient-purple-pink text-white px-4 py-1.5 text-xs md:text-sm hidden sm:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">+91 9876543210</span>
            </span>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">info@prashasaksamiti.com</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/akhandbharatkasankalp" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/prashasaksamitiofficial_" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://t.me/PrashasakSamitiOfficial" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Telegram">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.372-12 12 0 6.627 5.374 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm3.224 17.871c.188.133.43.166.646.085.215-.082.374-.253.413-.484.1-.585.185-1.124.25-1.555.128-.852.261-1.74.379-2.621.118-.881.212-1.751.3-2.622.044-.435.082-.872.118-1.309.036-.437.067-.873.091-1.308.009-.173-.04-.351-.135-.49-.092-.139-.233-.24-.39-.277-.157-.037-.323-.013-.468.068-.145.081-.252.214-.3.368-.058.254-.115.507-.17.759-.056.252-.11.503-.164.753-.107.5-.212.999-.318 1.499-.053.249-.108.498-.164.747-.057.25-.115.499-.175.748-.043.177-.086.355-.129.532-.042.178-.084.355-.125.532-.088.37-.177.739-.27 1.108-.092.37-.189.739-.29 1.108-.14.512-.285 1.023-.435 1.533-.15.51-.303 1.02-.465 1.53-.103.328-.21.655-.32.982-.11.326-.225.652-.345.978z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main header with logo, search, cart and account */}
      <div className="container mx-auto px-2 sm:px-4 py-3 relative bg-white">
        {/* Traditional decorative elements */}
        <div className="absolute left-0 top-0 w-16 h-16 opacity-10 hidden md:block">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FF5722" d="M50,0 C50,50 100,50 100,50 C50,50 50,100 50,100 C50,50 0,50 0,50 C50,50 50,0 50,0 Z"></path>
          </svg>
        </div>
        <div className="absolute right-0 top-0 w-16 h-16 opacity-10 hidden md:block">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FF5722" d="M50,0 C50,50 100,50 100,50 C50,50 50,100 50,100 C50,50 0,50 0,50 C50,50 50,0 50,0 Z"></path>
          </svg>
        </div>
        <div className="flex justify-between items-center relative z-10">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <span className="text-xl md:text-2xl font-bold text-gradient-full font-brand relative z-10">प्रशासक समिति</span>
                </div>
                <span className="text-xs text-text-light hidden md:block font-hindi">एकात्मीता सोशल वेलफेयर सोसायटी</span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-grow mx-4 lg:mx-8 max-w-2xl search">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 h-10 rounded-l-md focus:outline-none text-text text-base border-2 border-r-0 border-primary/20 focus:border-primary/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-purple-pink text-white px-4 h-10 rounded-r-md rounded-l-none hover:opacity-90 transition-opacity font-medium flex items-center justify-center min-w-[48px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Cart, Account Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button */}
            <button
              onClick={toggleMobileSearch}
              className="md:hidden text-text hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary/10 relative"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link href="/cart" className="hidden sm:block text-text hover:text-primary transition-colors relative p-2 rounded-full hover:bg-secondary/10" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0 right-0 bg-gradient-pink-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 transition-opacity duration-300">
                {cartItems.length}
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="relative hidden sm:block profile-dropdown">
                <button
                  onClick={toggleProfile}
                  className="text-text hover:text-primary transition-colors flex items-center p-2 rounded-full hover:bg-secondary/10 relative"
                  aria-label="Account"
                  aria-expanded={isProfileOpen}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className={`absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-pink-orange rounded-full ${isProfileOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}></span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 profile-dropdown-menu">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium">Hello, {user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Account
                    </Link>
                    <Link href="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href={`/login?redirect=${typeof window !== 'undefined' ? window.location.pathname : '/'}`} className="text-text hover:text-primary transition-colors hidden sm:flex items-center p-2 rounded-full hover:bg-secondary/10 relative" aria-label="Account">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-text hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary/10 relative"
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchVisible && (
        <div className="md:hidden border-t border-primary/20 bg-white z-40 shadow-sm">
          <div className="container mx-auto px-4 py-2">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 h-10 rounded-l-md focus:outline-none text-text text-base border-2 border-r-0 border-primary/20 focus:border-primary/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-purple-pink text-white px-4 h-10 rounded-r-md rounded-l-none hover:opacity-90 transition-opacity font-medium flex items-center justify-center min-w-[48px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sub-header with navigation links */}
      <div className="border-t border-primary/20 bg-white hidden md:block z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex justify-center space-x-6 py-2">
            <Link
              href="/"
              className={`text-${pathname === '/' ? 'primary' : 'text'} hover:text-primary transition-colors font-medium flex items-center px-3 py-2 relative group`}
            >
              <span className="mr-1.5">🏠</span> Home
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-pink-orange ${pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-300 origin-left`}></span>
            </Link>
            <Link
              href="/products"
              className={`text-${pathname === '/products' ? 'primary' : 'text'} hover:text-primary transition-colors font-medium flex items-center px-3 py-2 relative group`}
            >
              <span className="mr-1.5">🛍️</span> All Products
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-pink-orange ${pathname === '/products' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-300 origin-left`}></span>
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className={`text-${pathname.startsWith('/category') ? 'primary' : 'text'} hover:text-primary transition-colors font-medium flex items-center px-3 py-2 relative group`}>
                <span className="mr-1.5">📦</span> Categories
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-pink-orange ${pathname.startsWith('/category') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-300 origin-left`}></span>
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white rounded-md shadow-lg overflow-hidden z-20 transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-top-left hidden group-hover:block">
                <div className="py-2">
                  <Link href="/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors">
                    All Products
                  </Link>
                  {!categoriesLoading && parentCategories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Products Dropdown */}
            <div className="relative group">
              <button className={`text-${pathname.includes('featured=true') || pathname.includes('sort=') ? 'primary' : 'text'} hover:text-primary transition-colors font-medium flex items-center px-3 py-2 relative group`}>
                <span className="mr-1.5">⭐</span> Featured
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-pink-orange ${pathname.includes('featured=true') || pathname.includes('sort=') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-300 origin-left`}></span>
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white rounded-md shadow-lg overflow-hidden z-20 transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-top-left hidden group-hover:block">
                <div className="py-2">
                  <Link href="/products?featured=true" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors">
                    All Featured Products
                  </Link>
                  <Link href="/products?sort=rating" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors">
                    Top Rated Products
                  </Link>
                  <Link href="/products?sort=newest" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors">
                    New Arrivals
                  </Link>
                  {festivalCategories.length > 0 && (
                    <>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-1 text-xs font-semibold text-gray-500">FESTIVAL SPECIALS</div>
                      {festivalCategories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/category/${category.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className={`text-${pathname === '/about' ? 'primary' : 'text'} hover:text-primary transition-colors font-medium flex items-center px-3 py-2 relative group`}
            >
              <span className="mr-1.5">🚩</span> About Us
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-pink-orange ${pathname === '/about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-300 origin-left`}></span>
            </Link>

            <Link
              href="/blog"
              className={`text-${pathname === '/blog' || pathname.startsWith('/blog/') ? 'primary' : 'text'} hover:text-primary transition-colors font-medium flex items-center px-3 py-2 relative group`}
            >
              <span className="mr-1.5">📝</span> Blog
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-pink-orange ${pathname === '/blog' || pathname.startsWith('/blog/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-300 origin-left`}></span>
            </Link>

            <Link
              href="/contact"
              className={`text-${pathname === '/contact' ? 'primary' : 'text'} hover:text-primary transition-colors font-medium flex items-center px-3 py-2 relative group`}
            >
              <span className="mr-1.5">📞</span> Contact
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-pink-orange ${pathname === '/contact' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-300 origin-left`}></span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-primary/20 bg-white fixed top-[120px] left-0 right-0 z-40 max-h-[calc(100vh-120px)] overflow-y-auto shadow-lg">
          <div className="flex justify-between items-center px-4 py-3 border-b border-primary/20">
            <h3 className="font-medium text-lg text-text flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Menu
            </h3>
            <button
              onClick={toggleMenu}
              className="p-2 text-text hover:text-primary transition-colors rounded-full hover:bg-secondary/10"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>



          <nav className="flex flex-col px-4 py-2">
            <Link href="/" className="py-4 text-text hover:text-primary transition-colors text-lg border-b border-gray-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link href="/products" className="py-4 text-text hover:text-primary transition-colors text-lg border-b border-gray-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              All Products
            </Link>

            {/* Categories Dropdown */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                className="py-4 w-full text-text hover:text-primary transition-colors text-lg flex items-center justify-between"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Categories
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${mobileCategoryOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileCategoryOpen && (
                <div className="pl-8 pb-2">
                  <Link href="/products" className="py-3 block text-text hover:text-primary transition-colors text-base">
                    All Products
                  </Link>
                  {!categoriesLoading && parentCategories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      className="py-3 block text-text hover:text-primary transition-colors text-base"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Products Dropdown */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setMobileFeaturedOpen(!mobileFeaturedOpen)}
                className="py-4 w-full text-text hover:text-primary transition-colors text-lg flex items-center justify-between"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Featured
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${mobileFeaturedOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileFeaturedOpen && (
                <div className="pl-8 pb-2">
                  <Link href="/products?featured=true" className="py-3 block text-text hover:text-primary transition-colors text-base">
                    All Featured Products
                  </Link>
                  <Link href="/products?sort=rating" className="py-3 block text-text hover:text-primary transition-colors text-base">
                    Top Rated Products
                  </Link>
                  <Link href="/products?sort=newest" className="py-3 block text-text hover:text-primary transition-colors text-base">
                    New Arrivals
                  </Link>
                  {festivalCategories.length > 0 && (
                    <>
                      <div className="pt-1 pb-1 text-xs font-semibold text-gray-500">FESTIVAL SPECIALS</div>
                      {festivalCategories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/category/${category.slug}`}
                          className="py-3 block text-text hover:text-primary transition-colors text-base"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="/about" className="py-4 text-text hover:text-primary transition-colors text-lg border-b border-gray-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About Us
            </Link>

            <Link href="/blog" className="py-4 text-text hover:text-primary transition-colors text-lg border-b border-gray-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Blog
            </Link>

            <Link href="/contact" className="py-4 text-text hover:text-primary transition-colors text-lg border-b border-gray-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/account" className="py-4 text-text hover:text-primary transition-colors text-lg border-b border-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Account
                </Link>
                <Link href="/account/orders" className="py-4 text-text hover:text-primary transition-colors text-lg border-b border-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  My Orders
                </Link>
                {isAdmin && (
                  <Link href="/admin/dashboard" className="py-4 text-text hover:text-primary transition-colors text-lg border-b border-gray-100 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="py-4 text-text hover:text-primary transition-colors text-lg border-b border-gray-100 flex items-center text-left w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <Link href={`/login?redirect=${typeof window !== 'undefined' ? window.location.pathname : '/'}`} className="py-4 text-text hover:text-primary transition-colors text-lg border-b border-gray-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  // In a real implementation, these would be fetched from an API
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const faqCategories = [
    { id: 'general', name: 'General Questions' },
    { id: 'products', name: 'Products & Quality' },
    { id: 'orders', name: 'Orders & Shipping' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'account', name: 'Account & Payment' },
  ];

  // Sample FAQs for each category - in a real implementation, these would come from an API
  const faqs = {
    general: [
      {
        id: 'general-1',
        question: 'What is Prashasak Samiti?',
        answer: 'Prashasak Samiti is an e-commerce platform dedicated to providing authentic spiritual and religious products made with traditional methods and pure ingredients.'
      },
      {
        id: 'general-2',
        question: 'How can I contact customer support?',
        answer: 'You can reach our customer support team through email at support@prashasaksamiti.com, or by filling out the contact form on our Contact Us page.'
      },
      {
        id: 'general-3',
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. International shipping times and costs vary depending on the destination.'
      },
    ],
    products: [
      {
        id: 'products-1',
        question: 'How do you ensure the authenticity of your products?',
        answer: 'We work directly with traditional artisans and manufacturers who follow ancient methods and use authentic materials.'
      },
      {
        id: 'products-2',
        question: 'What materials are used in your idols?',
        answer: 'Our idols are made from various traditional materials including brass, copper, silver, clay, and marble.'
      },
    ],
    orders: [
      {
        id: 'orders-1',
        question: 'How long does shipping take?',
        answer: 'Domestic shipping within India typically takes 3-7 business days, depending on your location.'
      },
      {
        id: 'orders-2',
        question: 'What are the shipping costs?',
        answer: 'We offer free shipping on all domestic orders above ₹999. For orders below this amount, a flat shipping fee of ₹99 is applied.'
      },
    ],
    returns: [
      {
        id: 'returns-1',
        question: 'What is your return policy?',
        answer: 'We accept returns within 7 days of delivery for most products, provided they are unused and in their original packaging.'
      },
      {
        id: 'returns-2',
        question: 'How do I initiate a return?',
        answer: 'To initiate a return, log into your account, go to your order history, and select the "Return" option for the relevant order.'
      },
    ],
    account: [
      {
        id: 'account-1',
        question: 'How do I create an account?',
        answer: 'You can create an account by clicking on the "Account" icon in the top right corner of our website and selecting "Register".'
      },
      {
        id: 'account-2',
        question: 'What payment methods do you accept?',
        answer: 'We accept various payment methods including credit/debit cards, UPI, net banking, digital wallets, and cash on delivery (for select locations).'
      },
    ],
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80 z-10"></div>
        <div className="relative h-[40vh] min-h-[300px] max-h-[400px] w-full">
          <ImageWithFallback
            src="/images/faq-banner.jpg"
            alt="Frequently Asked Questions"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Frequently Asked Questions
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow">
              Find answers to common questions about our products, shipping, returns, and more
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* FAQ Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-gradient-purple-pink text-white'
                    : 'bg-white text-text hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">
              {faqCategories.find(cat => cat.id === activeCategory)?.name}
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="space-y-4">
                {faqs[activeCategory].map((faq) => (
                  <div
                    key={faq.id}
                    className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                      openFAQ === faq.id ? 'border-primary/50 shadow-md' : 'border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none"
                    >
                      <span className={openFAQ === faq.id ? 'text-primary' : 'text-text'}>
                        {faq.question}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${
                          openFAQ === faq.id ? 'transform rotate-180 text-primary' : 'text-gray-400'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-4 pt-0 text-text-light border-t border-gray-100">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Still Have Questions Section */}
        <div className="mt-12 bg-gradient-purple-pink text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="max-w-2xl mx-auto mb-6">
            If you couldn&apos;t find the answer to your question, our customer support team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors">
              Contact Us
            </Link>
            <a href="tel:+919876543210" className="bg-transparent hover:bg-white/10 border-2 border-white px-6 py-3 rounded-full font-medium transition-colors flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

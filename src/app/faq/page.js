'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageWithFallback from '../../components/common/ImageWithFallback';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const faqCategories = [
    { id: 'general', name: 'General Questions' },
    { id: 'products', name: 'Products & Quality' },
    { id: 'orders', name: 'Orders & Shipping' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'account', name: 'Account & Payment' },
  ];

  const faqs = {
    general: [
      {
        id: 'general-1',
        question: 'What is Prashasak Samiti?',
        answer: 'Prashasak Samiti is an e-commerce platform dedicated to providing authentic spiritual and religious products made with traditional methods and pure ingredients. We work directly with artisans across India to preserve traditional craftsmanship while ensuring the highest quality for our customers.'
      },
      {
        id: 'general-2',
        question: 'How can I contact customer support?',
        answer: 'You can reach our customer support team through multiple channels: by phone at +91 9876543210 (Monday to Saturday, 9 AM to 6 PM), by email at support@prashasaksamiti.com, or by filling out the contact form on our Contact Us page. We typically respond to all inquiries within 24 hours.'
      },
      {
        id: 'general-3',
        question: 'Do you have a physical store?',
        answer: 'Yes, we have our main showroom located in New Delhi. The address is 123 Temple Street, Spiritual District, New Delhi, 110001. We welcome you to visit us during our business hours: Monday to Saturday from 9 AM to 6 PM. We are closed on Sundays and have limited hours (10 AM to 2 PM) on major holidays.'
      },
      {
        id: 'general-4',
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. International shipping times and costs vary depending on the destination. Please note that customers are responsible for any customs duties or import taxes that may apply in their country.'
      },
      {
        id: 'general-5',
        question: 'How can I track my order?',
        answer: 'Once your order is shipped, you will receive a tracking number via email. You can use this number to track your package on our website by visiting the "Track Order" page or directly through the courier\'s website. You can also check your order status by logging into your account and viewing your order history.'
      },
    ],
    products: [
      {
        id: 'products-1',
        question: 'How do you ensure the authenticity of your products?',
        answer: 'We work directly with traditional artisans and manufacturers who follow ancient methods and use authentic materials. Each product undergoes quality checks to ensure it meets our standards for authenticity and craftsmanship. We also provide detailed information about the origin and making of our products so customers can make informed choices.'
      },
      {
        id: 'products-2',
        question: 'Are your puja items made according to Vedic guidelines?',
        answer: 'Yes, all our puja items are crafted according to traditional Vedic guidelines. We consult with religious scholars and traditional craftsmen to ensure that our products meet the requirements for proper ritual use. This includes using appropriate materials, following correct proportions, and adhering to traditional manufacturing processes.'
      },
      {
        id: 'products-3',
        question: 'What materials are used in your idols?',
        answer: 'Our idols are made from various traditional materials including Panchaloha (five-metal alloy), brass, copper, silver, clay, and marble. We clearly specify the material used for each product in its description. We avoid using synthetic materials for our religious idols to maintain authenticity and spiritual significance.'
      },
      {
        id: 'products-4',
        question: 'Are your cow products truly from indigenous cows?',
        answer: 'Yes, all our cow products come from indigenous Indian cow breeds (A2 milk cows) raised in traditional gaushalas (cow shelters) where they are treated with care and respect. We work with certified suppliers who maintain ethical standards in cow care and product processing.'
      },
      {
        id: 'products-5',
        question: 'Do you provide care instructions for your products?',
        answer: 'Yes, each product comes with specific care instructions to help maintain its quality and longevity. These instructions are included in the product packaging and are also available on our website in the product description. For special care queries, our customer support team is always available to assist you.'
      },
    ],
    orders: [
      {
        id: 'orders-1',
        question: 'How long does shipping take?',
        answer: 'Domestic shipping within India typically takes 3-7 business days, depending on your location. Metro cities usually receive deliveries within 3-4 days, while remote areas may take 5-7 days. International shipping varies by destination, ranging from 7-21 business days. Express shipping options are available at checkout for faster delivery.'
      },
      {
        id: 'orders-2',
        question: 'What are the shipping costs?',
        answer: 'We offer free shipping on all domestic orders above ₹999. For orders below this amount, a flat shipping fee of ₹99 is applied. International shipping costs vary based on destination country and package weight, which are calculated at checkout. We also offer express shipping options at additional costs.'
      },
      {
        id: 'orders-3',
        question: 'Can I change or cancel my order after placing it?',
        answer: 'You can modify or cancel your order within 2 hours of placing it by contacting our customer support team. After this window, if the order has entered the processing stage, we may not be able to make changes. However, we will try our best to accommodate your request if the order hasn\'t been shipped yet.'
      },
      {
        id: 'orders-4',
        question: 'Do you offer gift wrapping?',
        answer: 'Yes, we offer gift wrapping services for all our products. You can select the gift wrap option during checkout for a nominal fee of ₹50 per item. We use traditional, eco-friendly wrapping materials with spiritual motifs. You can also add a personalized message that will be included on a handwritten card.'
      },
      {
        id: 'orders-5',
        question: 'What happens if my package is damaged during shipping?',
        answer: 'If your package arrives damaged, please take photos of the damaged package and products before opening them completely. Contact our customer support within 48 hours of delivery with these photos and your order details. We will arrange for a replacement or refund based on the situation and product availability.'
      },
    ],
    returns: [
      {
        id: 'returns-1',
        question: 'What is your return policy?',
        answer: 'We accept returns within 7 days of delivery for most products, provided they are unused, in their original packaging, and in the same condition you received them. Some items like food products, customized items, and certain ritual items cannot be returned due to their nature. Please check the product page for specific return eligibility.'
      },
      {
        id: 'returns-2',
        question: 'How do I initiate a return?',
        answer: 'To initiate a return, log into your account, go to your order history, and select the "Return" option for the relevant order. Alternatively, you can contact our customer support with your order details. Once your return request is approved, you\'ll receive instructions on how to send the item back to us, along with a return shipping label if applicable.'
      },
      {
        id: 'returns-3',
        question: 'How long does it take to process refunds?',
        answer: 'Once we receive your returned item and verify its condition, we process the refund within 3-5 business days. The time it takes for the refund to appear in your account depends on your payment method: credit/debit cards typically take 5-7 business days, while bank transfers may take 7-10 business days. Refunds are issued to the original payment method used for the purchase.'
      },
      {
        id: 'returns-4',
        question: 'Do I have to pay for return shipping?',
        answer: 'If the return is due to a defect, damage, or error on our part, we cover the return shipping costs. For returns due to change of mind or other customer-initiated reasons, the return shipping cost is borne by the customer. This amount is deducted from the refund total unless you use our prepaid return shipping label, which has a flat fee based on your location.'
      },
      {
        id: 'returns-5',
        question: 'Can I exchange an item instead of returning it?',
        answer: 'Yes, we offer exchanges for items of equal or different value. If you wish to exchange for an item of higher value, you\'ll need to pay the difference. For lower value items, we\'ll refund the difference. To request an exchange, follow the same process as returns but select "Exchange" instead of "Return" and specify the item you want in exchange.'
      },
    ],
    account: [
      {
        id: 'account-1',
        question: 'How do I create an account?',
        answer: 'You can create an account by clicking on the "Account" icon in the top right corner of our website and selecting "Register". Fill in your details including name, email address, and password. Alternatively, you can also create an account during the checkout process. Once registered, you\'ll receive a confirmation email to verify your account.'
      },
      {
        id: 'account-2',
        question: 'What payment methods do you accept?',
        answer: 'We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express, RuPay), UPI, net banking, digital wallets (PayTM, PhonePe, Google Pay), and cash on delivery (for select locations in India). All online payments are processed through secure payment gateways with industry-standard encryption.'
      },
      {
        id: 'account-3',
        question: 'Is my payment information secure?',
        answer: 'Yes, we take payment security very seriously. We do not store your credit card details on our servers. All payment transactions are processed through secure and PCI-DSS compliant payment gateways with SSL encryption. We also implement additional security measures to protect your personal and payment information.'
      },
      {
        id: 'account-4',
        question: 'How can I reset my password?',
        answer: 'If you\'ve forgotten your password, click on the "Account" icon, select "Login", and then click on "Forgot Password". Enter your registered email address, and we\'ll send you a password reset link. Click on the link in the email and follow the instructions to create a new password. For security reasons, the reset link is valid for 24 hours only.'
      },
      {
        id: 'account-5',
        question: 'Can I save multiple shipping addresses?',
        answer: 'Yes, you can save multiple shipping addresses in your account for convenient checkout. To add or manage addresses, log into your account, go to "My Account" and select "Addresses". Here you can add new addresses, edit existing ones, or delete addresses you no longer need. You can also designate a default shipping address for faster checkout.'
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
          </div>
        </div>

        {/* Still Have Questions Section */}
        <div className="mt-12 bg-gradient-purple-pink text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="max-w-2xl mx-auto mb-6">
            If you couldn't find the answer to your question, our customer support team is here to help you.
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

'use client';

import { useState } from 'react';

export default function PaymentStep({ paymentMethod = '', onSubmit, onBack }) {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || 'UPI');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});

  // Payment methods - simplified to just Online Payment (RazorPay) and COD
  const paymentMethods = [
    {
      id: 'RazorPay',
      name: 'Online Payment',
      description: 'Pay securely with credit/debit cards, UPI, net banking, wallets, and more',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      id: 'COD',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  // Handle payment method selection
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setErrors({});
  };

  // Handle UPI ID change
  const handleUpiChange = (e) => {
    setUpiId(e.target.value);
    if (errors.upi) {
      setErrors({
        ...errors,
        upi: '',
      });
    }
  };

  // Handle card details change
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (selectedMethod === 'UPI') {
      if (!upiId.trim()) {
        newErrors.upi = 'UPI ID is required';
      } else if (!/^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/.test(upiId)) {
        newErrors.upi = 'Please enter a valid UPI ID (e.g., name@upi)';
      }
    } else if (selectedMethod === 'Card') {
      if (!cardDetails.number.trim()) {
        newErrors.number = 'Card number is required';
      } else if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
        newErrors.number = 'Please enter a valid 16-digit card number';
      }

      if (!cardDetails.name.trim()) {
        newErrors.name = 'Cardholder name is required';
      }

      if (!cardDetails.expiry.trim()) {
        newErrors.expiry = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
      }

      if (!cardDetails.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      let paymentData = {
        paymentMethod: selectedMethod,
      };

      if (selectedMethod === 'UPI') {
        paymentData.upiId = upiId;
      } else if (selectedMethod === 'Card') {
        paymentData.cardDetails = {
          // Only include last 4 digits for security
          lastFour: cardDetails.number.slice(-4),
          name: cardDetails.name,
          expiry: cardDetails.expiry,
        };
      }

      onSubmit(paymentData);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

      <form onSubmit={handleSubmit}>
        {/* Payment Method Selection */}
        <div className="space-y-4 mb-8">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMethod === method.id ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-200 hover:border-primary'
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary bg-opacity-10 text-primary mr-4">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                <div className="ml-4">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    selectedMethod === method.id ? 'border-primary' : 'border-gray-300'
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* UPI Payment Form */}
        {selectedMethod === 'UPI' && (
          <div className="mb-8">
            <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
              UPI ID *
            </label>
            <input
              type="text"
              id="upiId"
              value={upiId}
              onChange={handleUpiChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.upi ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="yourname@upi"
            />
            {errors.upi && <p className="mt-1 text-sm text-red-500">{errors.upi}</p>}

            <div className="mt-4 bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700">
                You will receive a payment request on your UPI app. Please complete the payment to confirm your order.
              </p>
            </div>
          </div>
        )}

        {/* Card Payment Form */}
        {selectedMethod === 'Card' && (
          <div className="mb-8 space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number *
              </label>
              <input
                type="text"
                id="cardNumber"
                name="number"
                value={cardDetails.number}
                onChange={handleCardChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength="16"
              />
              {errors.number && <p className="mt-1 text-sm text-red-500">{errors.number}</p>}
            </div>

            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name *
              </label>
              <input
                type="text"
                id="cardName"
                name="name"
                value={cardDetails.name}
                onChange={handleCardChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.expiry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiry && <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>}
              </div>

              <div>
                <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <input
                  type="password"
                  id="cardCvv"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
              </div>
            </div>

            <div className="mt-4 bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700">
                Your card information is secure and encrypted. We do not store your full card details.
              </p>
            </div>
          </div>
        )}

        {/* RazorPay Payment Message */}
        {selectedMethod === 'RazorPay' && (
          <div className="mb-8">
            <div className="bg-purple-50 p-4 rounded-md">
              <p className="text-sm text-purple-700 font-medium mb-2">
                You will be redirected to Razorpay&apos;s secure payment gateway after reviewing your order.
              </p>
              <p className="text-sm text-purple-700 mb-3">
                Choose from multiple payment options:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center">
                  <img src="/images/payment/card.svg" alt="Cards" className="h-6 mr-2" />
                  <span className="text-sm text-gray-700">Credit/Debit Cards</span>
                </div>
                <div className="flex items-center">
                  <img src="/images/payment/upi.svg" alt="UPI" className="h-6 mr-2" />
                  <span className="text-sm text-gray-700">UPI (Google Pay, PhonePe, etc.)</span>
                </div>
                <div className="flex items-center">
                  <img src="/images/payment/netbanking.svg" alt="Net Banking" className="h-6 mr-2" />
                  <span className="text-sm text-gray-700">Net Banking</span>
                </div>
                <div className="flex items-center">
                  <img src="/images/payment/wallet.svg" alt="Wallets" className="h-6 mr-2" />
                  <span className="text-sm text-gray-700">Wallets (Paytm, Amazon Pay, etc.)</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <img src="/images/payment/visa.svg" alt="Visa" className="h-6" />
                <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-6" />
                <img src="/images/payment/rupay.svg" alt="RuPay" className="h-6" />
                <img src="/images/payment/upi.svg" alt="UPI" className="h-6" />
              </div>
            </div>
          </div>
        )}

        {/* COD Payment Message */}
        {selectedMethod === 'COD' && (
          <div className="mb-8">
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-sm text-yellow-700 font-medium mb-2">
                Cash on Delivery
              </p>
              <p className="text-sm text-yellow-700">
                Please note that Cash on Delivery orders may take longer to process. Have the exact amount ready at the time of delivery.
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                For a faster delivery experience, we recommend using online payment options.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Back to Shipping
          </button>

          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  );
}

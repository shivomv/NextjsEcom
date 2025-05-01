"use client";

import { useState } from "react";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaUniversity,
  FaMobileAlt,
  FaWallet,
  FaCcVisa,
  FaCcMastercard,
  FaCcApplePay,
  FaGooglePay
} from "react-icons/fa";

export default function PaymentStep({ paymentMethod = "", onSubmit, onBack }) {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || "UPI");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  // Payment methods - simplified to just Online Payment (RazorPay) and COD
  const paymentMethods = [
    {
      id: "RazorPay",
      name: "Online Payment",
      description:
        "Pay securely with credit/debit cards, UPI, net banking, wallets, and more",
      icon: <FaCreditCard className="h-5 w-5" />,
    },
    {
      id: "COD",
      name: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: <FaMoneyBillWave className="h-5 w-5" />,
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
        upi: "",
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
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (selectedMethod === "UPI") {
      if (!upiId.trim()) {
        newErrors.upi = "UPI ID is required";
      } else if (!/^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/.test(upiId)) {
        newErrors.upi = "Please enter a valid UPI ID (e.g., name@upi)";
      }
    } else if (selectedMethod === "Card") {
      if (!cardDetails.number.trim()) {
        newErrors.number = "Card number is required";
      } else if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ""))) {
        newErrors.number = "Please enter a valid 16-digit card number";
      }

      if (!cardDetails.name.trim()) {
        newErrors.name = "Cardholder name is required";
      }

      if (!cardDetails.expiry.trim()) {
        newErrors.expiry = "Expiry date is required";
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.expiry = "Please enter a valid expiry date (MM/YY)";
      }

      if (!cardDetails.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        newErrors.cvv = "Please enter a valid CVV";
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

      if (selectedMethod === "UPI") {
        paymentData.upiId = upiId;
      } else if (selectedMethod === "Card") {
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
    <div className="p-3 sm:p-4 md:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
        Payment Method
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Payment Method Selection */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                selectedMethod === method.id
                  ? "border-primary bg-blue-light bg-opacity-5"
                  : "border-gray-200 hover:border-primary"
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full border bg-opacity-10 text-primary mr-3 sm:mr-4">
                  {method.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base">{method.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{method.description}</p>
                </div>
                <div className="ml-3 sm:ml-4 flex-shrink-0">
                  <div
                    className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full border flex items-center justify-center ${
                      selectedMethod === method.id
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* UPI Payment Form */}
        {selectedMethod === "UPI" && (
          <div className="mb-6 sm:mb-8">
            <label htmlFor="upiId" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              UPI ID *
            </label>
            <input
              type="text"
              id="upiId"
              value={upiId}
              onChange={handleUpiChange}
              className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.upi ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="yourname@upi"
            />
            {errors.upi && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.upi}</p>}

            <div className="mt-4 bg-blue-50 p-3 sm:p-4 rounded-md">
              <p className="text-xs sm:text-sm text-blue-700">
                You will receive a payment request on your UPI app. Please
                complete the payment to confirm your order.
              </p>
            </div>
          </div>
        )}

        {/* Card Payment Form */}
        {selectedMethod === "Card" && (
          <div className="mb-6 sm:mb-8 space-y-4">
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Card Number *
              </label>
              <input
                type="text"
                id="cardNumber"
                name="number"
                value={cardDetails.number}
                onChange={handleCardChange}
                className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.number ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength="16"
              />
              {errors.number && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.number}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="cardName"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Cardholder Name *
              </label>
              <input
                type="text"
                id="cardName"
                name="name"
                value={cardDetails.name}
                onChange={handleCardChange}
                className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cardExpiry"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Expiry Date *
                </label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.expiry ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiry && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.expiry}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cardCvv"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  CVV *
                </label>
                <input
                  type="password"
                  id="cardCvv"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.cvv ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div className="mt-4 bg-blue-50 p-3 sm:p-4 rounded-md">
              <p className="text-xs sm:text-sm text-blue-700">
                Your card information is secure and encrypted. We do not store
                your full card details.
              </p>
            </div>
          </div>
        )}

        {/* UPI Payment Form */}
        {selectedMethod === "UPI" && (
          <div className="mb-6 sm:mb-8">
            <label htmlFor="upiId" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              UPI ID *
            </label>
            <input
              type="text"
              id="upiId"
              value={upiId}
              onChange={handleUpiChange}
              className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.upi ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="yourname@upi"
            />
            {errors.upi && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.upi}</p>}

            <div className="mt-4 bg-blue-50 p-3 sm:p-4 rounded-md">
              <p className="text-xs sm:text-sm text-blue-700">
                You will receive a payment request on your UPI app. Please
                complete the payment to confirm your order.
              </p>
            </div>
          </div>
        )}

        {/* Card Payment Form */}
        {selectedMethod === "Card" && (
          <div className="mb-6 sm:mb-8 space-y-4">
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Card Number *
              </label>
              <input
                type="text"
                id="cardNumber"
                name="number"
                value={cardDetails.number}
                onChange={handleCardChange}
                className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.number ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength="16"
              />
              {errors.number && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.number}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="cardName"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Cardholder Name *
              </label>
              <input
                type="text"
                id="cardName"
                name="name"
                value={cardDetails.name}
                onChange={handleCardChange}
                className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cardExpiry"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Expiry Date *
                </label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.expiry ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiry && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.expiry}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cardCvv"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  CVV *
                </label>
                <input
                  type="password"
                  id="cardCvv"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  className={`w-full px-3 sm:px-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.cvv ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div className="mt-4 bg-blue-50 p-3 sm:p-4 rounded-md">
              <p className="text-xs sm:text-sm text-blue-700">
                Your card information is secure and encrypted. We do not store
                your full card details.
              </p>
            </div>
          </div>
        )}

        {/* RazorPay Payment Message */}
        {selectedMethod === "RazorPay" && (
          <div className="mb-6 sm:mb-8">
            <div className="bg-purple-50 p-3 sm:p-4 rounded-md">
              <p className="text-xs sm:text-sm text-purple-700 font-medium mb-2">
                You will be redirected to Razorpay&apos;s secure payment gateway
                after reviewing your order.
              </p>
              <p className="text-xs sm:text-sm text-purple-700 mb-2 sm:mb-3">
                Choose from multiple payment options:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="flex items-center">
                  <FaCreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                  <span className="text-xs sm:text-sm text-gray-700">
                    Credit/Debit Cards
                  </span>
                </div>
                <div className="flex items-center">
                  <FaMobileAlt className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                  <span className="text-xs sm:text-sm text-gray-700">
                    UPI (Google Pay, PhonePe)
                  </span>
                </div>
                <div className="flex items-center">
                  <FaUniversity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-600" />
                  <span className="text-xs sm:text-sm text-gray-700">Net Banking</span>
                </div>
                <div className="flex items-center">
                  <FaWallet className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
                  <span className="text-xs sm:text-sm text-gray-700">
                    Wallets (Paytm, Amazon Pay)
                  </span>
                </div>
              </div>

              <div className="mt-2 sm:mt-3 flex flex-wrap gap-3 sm:gap-4">
                <FaCcVisa className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700" />
                <FaCcMastercard className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                <FaGooglePay className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                <FaCcApplePay className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
              </div>
            </div>
          </div>
        )}

        {/* COD Payment Message */}
        {selectedMethod === "COD" && (
          <div className="mb-6 sm:mb-8">
            <div className="bg-yellow-50 p-3 sm:p-4 rounded-md">
              <p className="text-xs sm:text-sm text-yellow-700 font-medium mb-2">
                Cash on Delivery
              </p>
              <p className="text-xs sm:text-sm text-yellow-700">
                Please note that Cash on Delivery orders may take longer to
                process. Have the exact amount ready at the time of delivery.
              </p>
              <p className="text-xs sm:text-sm text-yellow-700 mt-2">
                For a faster delivery experience, we recommend using online
                payment options.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
          <button
            type="button"
            onClick={onBack}
            className="order-2 sm:order-1 w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base font-medium"
          >
            Back to Shipping
          </button>

          <button
            type="submit"
            className="order-1 sm:order-2 w-full sm:w-auto bg-primary text-white px-4 sm:px-6 py-3 sm:py-4 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base font-medium shadow-sm"
          >
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  );
}

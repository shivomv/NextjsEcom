"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import RazorpayButton from "@/components/payment/RazorpayButton";
import OrderReceiptPDF from "@/components/orders/OrderReceiptPDF";

export default function OrderDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  // Set isClient to true when component mounts and check for action query parameter
  useEffect(() => {
    setIsClient(true);

    // Redirect to login if not authenticated after client-side rendering
    if (isClient && !authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/account/orders/${id}`);
    }

    // Check for action query parameter
    if (isClient && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const action = urlParams.get("action");
      if (action) {
        setActiveAction(action);
      }
    }
  }, [isAuthenticated, authLoading, isClient, router, id]);

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoading(true);

        try {
          const response = await fetch(`/api/orders/${id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setOrder(data);

            // Handle action query parameter after order is loaded
            if (activeAction) {
              switch (activeAction) {
                case "cancel":
                  // Auto-trigger cancel if that's the action in the URL
                  if (
                    data.status === "Pending" ||
                    data.status === "Processing"
                  ) {
                    // We'll show a confirmation dialog in the UI instead of auto-cancelling
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    });
                  }
                  break;
                case "review":
                  // Scroll to review section
                  if (data.status === "Delivered") {
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    });
                  }
                  break;
                case "return":
                  // Scroll to return section
                  if (data.status === "Delivered") {
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    });
                  }
                  break;
              }
            }
          } else {
            // Handle error responses based on status code
            if (response.status === 404) {
              setError(
                "Order not found. Please check the order ID and try again."
              );
            } else {
              setError("Failed to load order. Please try again later.");
            }
          }
        } catch (apiError) {
          console.error("Error fetching from API:", apiError);
          setError(
            "Network error. Please check your connection and try again."
          );
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user && isClient) {
      fetchOrder();
    }
  }, [isAuthenticated, user, id, isClient, activeAction]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return "₹0.00";
    }
    return `₹${Number(price).toFixed(2)}`;
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get tracking URL based on courier service
  const getTrackingUrl = (trackingNumber, courier) => {
    if (!trackingNumber) return "#";

    switch (courier?.toLowerCase()) {
      case "indiapost":
        return `https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx?ConsignmentNo=${trackingNumber}`;
      case "delhivery":
        return `https://www.delhivery.com/track/?tracking_id=${trackingNumber}`;
      case "bluedart":
        return `https://www.bluedart.com/tracking?trackingId=${trackingNumber}`;
      case "dtdc":
        return `https://www.dtdc.in/tracking/tracking_results.asp?TrkType=Tracking_Awb&TrackingID=${trackingNumber}`;
      case "fedex":
        return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
      case "dhl":
        return `https://www.dhl.com/in-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`;
      case "ekart":
        return `https://ekartlogistics.com/shipmenttrack/${trackingNumber}`;
      default:
        return `https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx?ConsignmentNo=${trackingNumber}`;
    }
  };

  // Check if an order has reached a specific status
  const hasReachedStatus = (order, status) => {
    // If the order has statusTimeline, use it
    if (order.statusTimeline && order.statusTimeline[status]) {
      return order.statusTimeline[status].completed;
    }

    // Fallback to status history if available
    if (order.statusHistory && order.statusHistory.length > 0) {
      return order.statusHistory.some((entry) => entry.status === status);
    }

    // For backward compatibility with existing orders
    const statusRank = {
      Pending: 1,
      Processing: 2,
      Shipped: 3,
      Delivered: 4,
    };

    // If the order is cancelled, only return true for 'Cancelled'
    if (order.status === "Cancelled") {
      return status === "Cancelled";
    }

    // Otherwise, check if the current status is at or beyond the requested status
    return statusRank[order.status] >= statusRank[status];
  };

  // Get the timestamp when a status was reached
  const getStatusTimestamp = (order, status) => {
    // If the order has statusTimeline, use it
    if (
      order.statusTimeline &&
      order.statusTimeline[status] &&
      order.statusTimeline[status].completed
    ) {
      return order.statusTimeline[status].timestamp;
    }

    // Fallback to status history if available
    if (order.statusHistory && order.statusHistory.length > 0) {
      const statusEntry = order.statusHistory.find(
        (entry) => entry.status === status
      );
      return statusEntry ? statusEntry.timestamp : null;
    }

    // For backward compatibility
    if (status === "Pending") return order.createdAt;
    if (status === "Delivered" && order.status === "Delivered")
      return order.deliveredAt;
    return null;
  };

  // Get courier name for display
  const getCourierName = (courier) => {
    switch (courier?.toLowerCase()) {
      case "indiapost":
        return "India Post";
      case "delhivery":
        return "Delhivery";
      case "bluedart":
        return "BlueDart";
      case "dtdc":
        return "DTDC";
      case "fedex":
        return "FedEx";
      case "dhl":
        return "DHL";
      case "ekart":
        return "Ekart Logistics";
      default:
        return "India Post";
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async () => {
    console.log("Cancel button clicked");

    if (
      !confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      console.log("Cancellation cancelled by user");
      return;
    }

    console.log("Starting cancellation process");
    setIsCancelling(true);
    setCancelSuccess(false);

    try {
      console.log("Sending cancellation request to API");
      console.log("Order ID:", id);
      console.log("User token:", user.token ? "Token exists" : "No token");

      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          status: "Cancelled",
          notes: "Cancelled by customer",
        }),
      });

      console.log("API response status:", response.status);
      const data = await response.json();
      console.log("API response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel order");
      }

      // Update the order in state
      console.log("Updating order in state");
      setOrder(data);
      setCancelSuccess(true);

      // Show success message
      alert("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(`Failed to cancel order: ${error.message}`);
    } finally {
      setIsCancelling(false);
      console.log("Cancellation process completed");
    }
  };

  // Show loading state while checking authentication or loading order
  if (authLoading || !isClient || isLoading) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4 flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // Error state
  if (error) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Order Not Found
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/account/orders"
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Back to Orders
                </Link>
                <Link
                  href="/"
                  className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No order
  if (!order) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-500 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Order Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                We could not find the order you are looking for.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/account/orders"
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Back to Orders
                </Link>
                <Link
                  href="/"
                  className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back button and order info */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Order #{order.orderNumber || order.id}
            </h1>
            <p className="text-text-light">
              Placed on{" "}
              {order.createdAt
                ? formatDate(order.createdAt)
                : formatDate(order.date)}
            </p>
          </div>
          <Link
            href="/account/orders"
            className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order details and items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Status
              </h2>

              {/* Success message */}
              {cancelSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                  <div className="flex items-center">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p>
                      Your order has been successfully cancelled. Any payment
                      will be refunded according to our refund policy.
                    </p>
                  </div>
                </div>
              )}
              {/* Order Status Timeline */}
              <div className="mb-6">
                <div className="relative">
                  {/* Timeline Track */}
                  <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>

                  {/* Timeline Steps */}
                  <div className="space-y-8">
                    {/* Order Placed */}
                    <div className="relative flex items-start">
                      <div
                        className={`absolute left-0 rounded-full h-10 w-10 flex items-center justify-center ${
                          hasReachedStatus(order, "Pending")
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
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
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <div className="ml-14">
                        <h3 className="text-base font-medium text-gray-900">
                          Order Placed
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {formatDate(order.createdAt || order.date)}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Payment Method:{" "}
                          <span className="font-medium">
                            {order.paymentMethod}
                          </span>
                        </p>
                        {order.isPaid && (
                          <p className="mt-1 text-sm text-green-600">
                            Paid on {formatDate(order.paidAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Processing */}
                    <div className="relative flex items-start">
                      <div
                        className={`absolute left-0 rounded-full h-10 w-10 flex items-center justify-center ${
                          hasReachedStatus(order, "Processing")
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-14">
                        <h3 className="text-base font-medium text-gray-900">
                          Processing
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {hasReachedStatus(order, "Processing")
                            ? getStatusTimestamp(order, "Processing")
                              ? `Processed on ${formatDate(
                                  getStatusTimestamp(order, "Processing")
                                )}`
                              : "Your order has been processed."
                            : "Waiting to be processed."}
                        </p>
                      </div>
                    </div>

                    {/* Shipped */}
                    <div className="relative flex items-start">
                      <div
                        className={`absolute left-0 rounded-full h-10 w-10 flex items-center justify-center ${
                          hasReachedStatus(order, "Shipped")
                            ? "bg-purple-100 text-purple-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                          />
                        </svg>
                      </div>
                      <div className="ml-14">
                        <h3 className="text-base font-medium text-gray-900">
                          Shipped
                        </h3>
                        {hasReachedStatus(order, "Shipped") ? (
                          <>
                            <p className="mt-1 text-sm text-gray-600">
                              Your order has been shipped and is on its way to
                              you.
                              {getStatusTimestamp(order, "Shipped") && (
                                <span className="block mt-1">
                                  Shipped on{" "}
                                  {formatDate(
                                    getStatusTimestamp(order, "Shipped")
                                  )}
                                </span>
                              )}
                            </p>
                            {(order.trackingNumber || order.trackingId) && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm font-medium text-gray-700">
                                  Tracking Information
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Courier:{" "}
                                  <span className="font-medium">
                                    {getCourierName(
                                      order.courier || "indiapost"
                                    )}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Tracking Number:{" "}
                                  <span className="font-medium">
                                    {order.trackingNumber || order.trackingId}
                                  </span>
                                </p>
                                {order.deliveryDate && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    Expected Delivery:{" "}
                                    <span className="font-medium">
                                      {order.deliveryDate}
                                    </span>
                                  </p>
                                )}
                                <div className="mt-2">
                                  <a
                                    href={getTrackingUrl(
                                      order.trackingNumber || order.trackingId,
                                      order.courier || "indiapost"
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm text-primary hover:text-primary-dark transition-colors"
                                  >
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
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                    Track Your Package
                                  </a>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="mt-1 text-sm text-gray-600">
                            Your order has not been shipped yet.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delivered */}
                    <div className="relative flex items-start">
                      <div
                        className={`absolute left-0 rounded-full h-10 w-10 flex items-center justify-center ${
                          hasReachedStatus(order, "Delivered")
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="ml-14">
                        <h3 className="text-base font-medium text-gray-900">
                          Delivered
                        </h3>
                        {hasReachedStatus(order, "Delivered") ? (
                          <>
                            <p className="mt-1 text-sm text-gray-600">
                              Your order has been delivered.
                            </p>
                            {order.deliveredAt && (
                              <p className="mt-1 text-sm text-green-600">
                                Delivered on {formatDate(order.deliveredAt)}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="mt-1 text-sm text-gray-600">
                            Your order has not been delivered yet.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Received */}
                    {hasReachedStatus(order, "Payment Received") && (
                      <div className="relative flex items-start">
                        <div className="absolute left-0 rounded-full h-10 w-10 flex items-center justify-center bg-green-100 text-green-600">
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
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-14">
                          <h3 className="text-base font-medium text-gray-900">
                            Payment Received
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Your payment has been received.
                          </p>
                          {getStatusTimestamp(order, "Payment Received") && (
                            <p className="mt-1 text-sm text-green-600">
                              Received on{" "}
                              {formatDate(
                                getStatusTimestamp(order, "Payment Received")
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cancelled (only show if order is cancelled) */}
                    {order.status === "Cancelled" && (
                      <div className="relative flex items-start">
                        <div className="absolute left-0 rounded-full h-10 w-10 flex items-center justify-center bg-red-100 text-red-600">
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
                        </div>
                        <div className="ml-14">
                          <h3 className="text-base font-medium text-gray-900">
                            Cancelled
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Your order has been cancelled.
                          </p>
                          {order.cancellationReason && (
                            <p className="mt-1 text-sm text-gray-600">
                              Reason:{" "}
                              <span className="font-medium">
                                {order.cancellationReason}
                              </span>
                            </p>
                          )}
                          {order.refundStatus && (
                            <p className="mt-1 text-sm text-green-600">
                              Refund Status:{" "}
                              <span className="font-medium">
                                {order.refundStatus}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Status Badge */}
              <div className="flex items-center mt-4">
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                    order.status
                  )}`}
                >
                  Current Status: {order.status}
                </span>
              </div>

              {order.status === "cancelled" && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Cancellation Details
                  </h3>
                  {order.cancellationReason && (
                    <p className="text-sm text-gray-900">
                      Reason:{" "}
                      <span className="font-medium">
                        {order.cancellationReason}
                      </span>
                    </p>
                  )}
                  {order.refundStatus && (
                    <p className="text-sm text-green-600 mt-1">
                      Refund Status:{" "}
                      <span className="font-medium">{order.refundStatus}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Order items */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Order Items
                </h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {(order.orderItems || order.items).map((item, index) => (
                  <li key={item._id || item.id || index} className="relative">
                    <Link
                      href={`/products/${item.product}`}
                      className="absolute inset-0 z-10"
                      aria-label={`View ${item.name} details`}
                    ></Link>
                    <div className="px-6 py-4 flex items-center group hover:bg-gray-50 transition-colors">
                      <div className="h-16 w-16 flex-shrink-0 relative">
                        {item.image ? (
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.qty || item.quantity} x{" "}
                          {formatPrice(item.price)} ={" "}
                          {formatPrice(
                            (item.qty || item.quantity) * item.price
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Items Total:</span>
                  <span>{formatPrice(order.itemsPrice || order.total)}</span>
                </div>
                {order.taxPrice && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-medium">Tax:</span>
                    <span>{formatPrice(order.taxPrice)}</span>
                  </div>
                )}
                {order.shippingPrice !== undefined && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-medium">Shipping:</span>
                    <span>
                      {order.shippingPrice === 0
                        ? "Free"
                        : formatPrice(order.shippingPrice)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t border-gray-200">
                  <span>Total:</span>
                  <span>{formatPrice(order.totalPrice || order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer info and order actions */}
          <div className="space-y-6">
            {/* Shipping info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Shipping Information
              </h2>
              <div>
                <p className="text-sm text-gray-900">
                  {order.shippingAddress.name}
                </p>
                <p className="text-sm text-gray-900">
                  {order.shippingAddress.address ||
                    order.shippingAddress.addressLine1}
                </p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-sm text-gray-900">
                    {order.shippingAddress.addressLine2}
                  </p>
                )}
                <p className="text-sm text-gray-900">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode ||
                    order.shippingAddress.pincode}
                </p>
                <p className="text-sm text-gray-900">
                  {order.shippingAddress.country}
                </p>
                <p className="text-sm text-gray-900 mt-2">
                  <span className="font-medium">Phone:</span>{" "}
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Payment Information
              </h2>
              <p className="text-sm text-gray-900">
                <span className="font-medium">Method:</span>{" "}
                {order.paymentMethod}
              </p>
              <p
                className={`text-sm ${
                  !order.isPaid && order.paymentMethod === "RazorPay"
                    ? "text-red-600 font-medium"
                    : "text-gray-900"
                } mt-1`}
              >
                <span className="font-medium">Status:</span>{" "}
                {order.isPaid
                  ? "Paid"
                  : order.paymentMethod === "RazorPay"
                  ? "Payment Required"
                  : "Pending"}
              </p>
              {order.isPaid && order.paidAt && (
                <p className="text-sm text-gray-900 mt-1">
                  <span className="font-medium">Paid on:</span>{" "}
                  {formatDate(order.paidAt)}
                </p>
              )}

              {/* Payment details for paid orders */}
              {order.isPaid && order.paymentResult && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Payment Details
                  </h3>
                  {order.paymentResult.id && (
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Transaction ID:</span>{" "}
                      {order.paymentResult.id}
                    </p>
                  )}
                  {order.paymentResult.receipt_number && (
                    <p className="text-sm text-gray-900 mt-1">
                      <span className="font-medium">Receipt Number:</span>{" "}
                      {order.paymentResult.receipt_number}
                    </p>
                  )}
                  {order.paymentResult.amount && (
                    <p className="text-sm text-gray-900 mt-1">
                      <span className="font-medium">Amount Paid:</span>{" "}
                      {formatPrice(order.paymentResult.amount)}
                    </p>
                  )}
                  {order.paymentResult.gateway && (
                    <p className="text-sm text-gray-900 mt-1">
                      <span className="font-medium">Payment Gateway:</span>{" "}
                      {order.paymentResult.gateway}
                    </p>
                  )}

                  {/* Download Receipt Button */}
                  <div className="mt-3">
                    <OrderReceiptPDF order={order} user={user} />
                  </div>
                </div>
              )}

              {/* RazorPay Payment Button for unpaid orders */}
              {!order.isPaid && order.paymentMethod === "RazorPay" && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-yellow-50 p-4 rounded-md mb-4">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-600 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <h3 className="font-medium text-yellow-800">
                        Payment Required
                      </h3>
                    </div>
                    <p className="text-sm text-yellow-700 mt-2">
                      Your order has been placed but payment is pending. Please
                      complete your payment to process your order.
                    </p>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">
                    Complete your online payment securely. You can pay using
                    credit/debit cards, UPI, net banking, or wallets.
                  </p>

                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-md mb-4">
                    <RazorpayButton
                      orderId={order._id}
                      onSuccess={(data) => {
                        // Refresh the order data after successful payment
                        setOrder({
                          ...order,
                          isPaid: true,
                          paidAt: new Date().toISOString(),
                        });
                      }}
                      onError={(error) => {
                        console.error("Payment failed:", error);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Order actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Actions
              </h2>

              {/* Action highlight based on URL parameter */}
              {activeAction && (
                <div className={`mb-4 p-3 rounded-md ${
                  activeAction === 'cancel' ? 'bg-red-50 border border-red-200 text-red-700' :
                  activeAction === 'review' ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' :
                  activeAction === 'return' ? 'bg-orange-50 border border-orange-200 text-orange-700' : ''
                }`}>
                  {activeAction === 'cancel' && (
                    <p>You can cancel your order below if it hasn't been shipped yet.</p>
                  )}
                  {activeAction === 'review' && (
                    <p>You can write a review for this product now that it has been delivered.</p>
                  )}
                  {activeAction === 'return' && (
                    <p>If you're not satisfied with your order, you can request a return below.</p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {(order.status === "delivered" || order.status === "Delivered") && (
                  <a
                    href={`/products/${order.orderItems[0].product}?review=true`}
                    className={`w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center ${activeAction === 'review' ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}`}
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Write a Review
                  </a>
                )}
                {(order.status === "Pending" ||
                  order.status === "pending" ||
                  order.status === "Processing" ||
                  order.status === "processing") && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className={`w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${activeAction === 'cancel' ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
                  >
                    {isCancelling ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Cancelling...
                      </>
                    ) : (
                      <>
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Cancel Order
                      </>
                    )}
                  </button>
                )}
                {(order.status === "delivered" || order.status === "Delivered") && (
                  <button
                    className={`w-full px-4 py-2 border border-yellow-500 text-yellow-500 bg-white rounded-md hover:bg-yellow-50 transition-colors flex items-center justify-center ${activeAction === 'return' ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}`}
                    onClick={() => alert('Return functionality will be available soon. Please contact customer support for assistance.')}
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
                        d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                      />
                    </svg>
                    Return Order
                  </button>
                )}
                <button className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

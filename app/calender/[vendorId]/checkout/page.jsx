"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const CalendarCheckoutPage = () => {
  const params = useParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    // Retrieve order data from localStorage
    const storedData = localStorage.getItem("calendarOrderData");
    if (storedData) {
      const data = JSON.parse(storedData);

      // Sort items by date in ascending order
      const sortedItems = data.items.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      setOrderData({
        ...data,
        items: sortedItems,
      });
    }
    setLoading(false);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      fullDate: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  };

  const handleBackToCalendar = () => {
    if (orderPlaced) {
      // Clear order data and redirect to main page
      localStorage.removeItem("calendarOrderData");
      router.push(`/booking/${params.customerId}/${params.vendorId}/breakfast`);
    } else {
      router.back();
    }
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);

    try {
      // Simulate API call - replace with actual order placement logic
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically call your order placement API
      // const response = await fetch('/api/orders/place', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });

      setOrderPlaced(true);
      setIsPlacingOrder(false);
    } catch (error) {
      console.error("Error placing order:", error);
      setIsPlacingOrder(false);
      // Handle error - show error message
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Order Data Found
          </h2>
          <button
            onClick={() =>
              router.push(`/calender/${params.vendorId}/${params.customerId}`)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h1>

            <p className="text-gray-600 mb-6">
              Your meal plan has been confirmed. You'll receive notifications
              for each delivery.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 mb-1">Total Amount</div>
              <div className="text-2xl font-bold text-green-600">
                {(orderData.grandTotal || 0).toFixed(0)} DKK
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBackToCalendar}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => router.push(`/myOrders/${params.customerId}`)}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackToCalendar}
                className="mr-4 p-2 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Calendar Order Checkout
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Your Meal Plan ({orderData.items.length} days)
                </h2>
              </div>

              <div className="p-6 space-y-8">
                {orderData.items.map((dayItem, index) => {
                  const { day, fullDate } = formatDate(dayItem.date);
                  const dayTotal = dayItem.meals.reduce(
                    (sum, meal) => sum + meal.price * meal.quantity,
                    0
                  );
                  const isToday =
                    new Date(dayItem.date).toDateString() ===
                    new Date().toDateString();
                  const isPast =
                    new Date(dayItem.date) < new Date().setHours(0, 0, 0, 0);

                  return (
                    <div key={index} className="relative">
                      {/* Date Header */}
                      <div
                        className={`border-l-4 pl-6 pb-4 ${
                          isToday
                            ? "border-amber-500 bg-amber-50"
                            : isPast
                            ? "border-gray-300 bg-gray-50"
                            : "border-blue-500 bg-blue-50"
                        } rounded-r-lg`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3
                              className={`text-xl font-bold ${
                                isToday ? "text-amber-900" : "text-gray-900"
                              }`}
                            >
                              {day}
                              {isToday && (
                                <span className="ml-2 text-sm bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                                  Today
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">{fullDate}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {dayItem.meals.length} meal
                              {dayItem.meals.length !== 1 ? "s" : ""}
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              {dayTotal.toFixed(0)} DKK
                            </div>
                          </div>
                        </div>

                        {/* Meals for this day */}
                        <div className="space-y-3">
                          {dayItem.meals.map((meal, mealIndex) => (
                            <div
                              key={mealIndex}
                              className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border"
                            >
                              <img
                                src={meal.imageUrl}
                                alt={meal.name}
                                className="h-16 w-16 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&auto=format";
                                }}
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-lg">
                                  {meal.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Quantity: {meal.quantity} × {meal.price} DKK
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  {(meal.price * meal.quantity).toFixed(0)} DKK
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Connector line to next day */}
                      {index < orderData.items.length - 1 && (
                        <div className="flex justify-center py-4">
                          <div className="w-px h-8 bg-gray-300"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm border mt-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Information
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">
                    Delivery Time: 12:00 PM - 1:00 PM (Daily)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">
                    Address: [Customer Address]
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Planning Days</span>
                  <span className="font-medium">{orderData.items.length}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">
                    {orderData.totalItems || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {(orderData.totalPrice || 0).toFixed(0)} DKK
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {orderData.deliveryFee || 0} DKK
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      {(orderData.grandTotal || 0).toFixed(0)} DKK
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className={`w-full mt-6 py-4 px-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                    isPlacingOrder
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                  } text-white`}
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-6 w-6 mr-3" />
                      Place Order
                    </>
                  )}
                </button>

                {!isPlacingOrder && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    By placing this order, you agree to our terms and conditions
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarCheckoutPage;

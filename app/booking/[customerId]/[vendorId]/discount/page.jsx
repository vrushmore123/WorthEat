"use client"; 
import React, { useState, useEffect } from 'react';
import { Clock, ShoppingCart, Tag, Timer } from 'lucide-react';

const CancelledOrdersPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const cancelledOrders = [
    {
      id: 'CO001',
      dishName: 'Margherita Pizza',
      originalPrice: 299,
      restaurant: 'Pizza Palace',
      cuisine: 'Italian',
      preparationTime: '20-25 min',
      description: 'Fresh basil, mozzarella, and tomato sauce on thin crust'
    },
    {
      id: 'CO002',
      dishName: 'Chicken Biryani',
      originalPrice: 349,
      restaurant: 'Spice Garden',
      cuisine: 'Indian',
      preparationTime: '30-35 min',
      description: 'Aromatic basmati rice with tender chicken and exotic spices'
    },
    {
      id: 'CO003',
      dishName: 'Caesar Salad',
      originalPrice: 199,
      restaurant: 'Green Bowl',
      cuisine: 'Continental',
      preparationTime: '10-15 min',
      description: 'Crisp romaine lettuce with parmesan and caesar dressing'
    },
    {
      id: 'CO004',
      dishName: 'Pad Thai Noodles',
      originalPrice: 279,
      restaurant: 'Bangkok Street',
      cuisine: 'Thai',
      preparationTime: '15-20 min',
      description: 'Stir-fried rice noodles with vegetables and tamarind sauce'
    },
    {
      id: 'CO005',
      dishName: 'Grilled Salmon',
      originalPrice: 499,
      restaurant: 'Ocean Grill',
      cuisine: 'Seafood',
      preparationTime: '25-30 min',
      description: 'Fresh Atlantic salmon with lemon herb seasoning'
    },
    {
      id: 'CO006',
      dishName: 'Chocolate Brownie',
      originalPrice: 149,
      restaurant: 'Sweet Treats',
      cuisine: 'Dessert',
      preparationTime: '5-10 min',
      description: 'Rich chocolate brownie served warm with vanilla ice cream'
    },
    {
      id: 'CO007',
      dishName: 'Veggie Burger',
      originalPrice: 229,
      restaurant: 'Healthy Bites',
      cuisine: 'American',
      preparationTime: '15-20 min',
      description: 'Plant-based patty with fresh vegetables and avocado'
    }
  ];

  const calculateDiscountedPrice = (originalPrice) => {
    return Math.round(originalPrice * 0.75); // 25% discount
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Flash Sale - Cancelled Orders</h1>
              <p className="text-gray-600 mt-2">Get amazing deals on freshly prepared meals - 25% off!</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-700 mb-1">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-semibold">{formatTime(currentTime)}</span>
              </div>
              <div className="text-sm text-gray-500">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Banner */}
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-8 rounded-r-lg">
          <div className="flex items-center">
            <Tag className="w-6 h-6 text-orange-600 mr-3" />
            <div>
              <p className="text-orange-800 font-semibold">Limited Time Offer!</p>
              <p className="text-orange-700">These cancelled orders are available at 25% discount. Order now before they're gone!</p>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cancelledOrders.map((order) => {
            const discountedPrice = calculateDiscountedPrice(order.originalPrice);
            const savings = order.originalPrice - discountedPrice;

            return (
              <div key={order.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  {/* Discount Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      25% OFF
                    </span>
                    <span className="text-gray-500 text-sm">#{order.id}</span>
                  </div>

                  {/* Dish Details */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{order.dishName}</h3>
                  <p className="text-gray-600 text-sm mb-3">{order.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Restaurant:</span>
                      <span className="font-medium text-gray-700">{order.restaurant}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Cuisine:</span>
                      <span className="font-medium text-gray-700">{order.cuisine}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center">
                        <Timer className="w-4 h-4 mr-1" />
                        Prep Time:
                      </span>
                      <span className="font-medium text-gray-700">{order.preparationTime}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">Original Price:</span>
                      <span className="text-gray-400 line-through text-lg">₹{order.originalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-semibold">Discounted Price:</span>
                      <span className="text-green-600 font-bold text-xl">₹{discountedPrice}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-green-600 text-sm font-medium">You save ₹{savings}!</span>
                    </div>
                  </div>

                  {/* Order Button */}
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Order Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Why These Deals?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Fresh & Ready</h4>
              <p>All meals are freshly prepared and ready to be delivered immediately.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Quality Guaranteed</h4>
              <p>Same high-quality food from your favorite restaurants at discounted prices.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Limited Availability</h4>
              <p>Once sold out, these specific meals won't be available again at this price.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelledOrdersPage;
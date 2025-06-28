import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Minus, 
  Clock, 
  Calendar,
  Trash2,
  ShoppingCart,
  MapPin
} from 'lucide-react';

const DateDetailModal = ({ 
  isOpen, 
  onClose, 
  date, 
  meals, 
  onUpdateQuantity, 
  onRemoveMeal,
  onAddToCart,
  deliveryTime,
  onChangeDeliveryTime,
  availableTimeSlots = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM", 
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM"
  ]
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!isOpen || !date || !meals) return null;

  const totalMeals = meals.reduce((sum, meal) => sum + meal.qty, 0);
  const totalPrice = meals.reduce((sum, meal) => sum + (meal.food.price * meal.qty), 0);
  const dateStr = new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleAddAllToCart = async () => {
    setIsAddingToCart(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    meals.forEach(meal => {
      onAddToCart(meal.food, meal.qty, date);
    });
    
    setIsAddingToCart(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800/50 dark:to-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {dateStr}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      {totalMeals} meal{totalMeals !== 1 ? 's' : ''} planned
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-700/50 rounded-full transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Delivery Time Selector */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/10">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Delivery Time
                  </label>
                  <select
                    value={deliveryTime}
                    onChange={(e) => onChangeDeliveryTime(e.target.value)}
                    className="block w-full border-gray-200 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 p-3 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Meals List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6 space-y-4">
                {meals.map((meal, index) => (
                  <motion.div
                    key={`${meal.food.id}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200/50 dark:border-gray-600/50"
                  >
                    <div className="flex items-center gap-4">
                      {/* Meal Image */}
                      <div className="w-16 h-16 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                        <img
                          src={meal.food.imageUrl}
                          alt={meal.food.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&auto=format`;
                          }}
                        />
                      </div>

                      {/* Meal Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {meal.food.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {meal.food.restaurant}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                            {meal.food.price} DKK each
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            • {meal.food.prepTime || "15-20 min"}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full overflow-hidden shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(meal.food.id, meal.qty - 1)}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                            disabled={meal.qty <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-200 min-w-[3rem] text-center">
                            {meal.qty}
                          </span>
                          
                          <button
                            onClick={() => onUpdateQuantity(meal.food.id, meal.qty + 1)}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right min-w-[80px]">
                          <div className="font-bold text-gray-800 dark:text-gray-200">
                            {(meal.food.price * meal.qty).toFixed(0)} DKK
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveMeal(meal.food.id)}
                          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200 hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-orange-50 dark:from-gray-800/50 dark:to-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Delivery at {deliveryTime}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {totalMeals} items
                  </div>
                  <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {totalPrice.toFixed(0)} DKK
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={handleAddAllToCart}
                  disabled={isAddingToCart || meals.length === 0}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isAddingToCart || meals.length === 0
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25'
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add All to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DateDetailModal;

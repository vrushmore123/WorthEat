import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Clock,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Calendar,
} from "lucide-react";

const FoodItemModal = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
  showDatePicker = false,
  availableDates = [],
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Handle window resize
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedDate(null);
      setIsFavorite(false);
    }
  }, [isOpen]);

  const handleAddToCart = async () => {
    setIsAdding(true);

    setTimeout(() => {
      if (showDatePicker && selectedDate) {
        onAddToCart(
          {
            ...item,
            quantity,
            specialInstructions,
            totalPrice: item.price * quantity,
          },
          quantity,
          selectedDate
        );
      } else {
        onAddToCart(
          {
            ...item,
            quantity,
            specialInstructions,
            totalPrice: item.price * quantity,
          },
          quantity
        );
      }
      setIsAdding(false);
      onClose();
      setQuantity(1);
      setSelectedDate(null);
    }, 500);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (!item) return null;

  // Ensure image is always available
  const fallbackImage =
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80";
  const imageUrl = item.image || fallbackImage;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col"
          >
            {/* Header with Image - Fixed height */}
            <div className="relative flex-shrink-0">
              <img
                src={imageUrl}
                alt={item.name}
                className="w-full h-48 sm:h-56 object-cover"
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&auto=format`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full hover:bg-white transition-colors shadow-lg z-10"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Favorite button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-3 left-3 sm:top-4 sm:left-4 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg z-10"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                    isFavorite ? "text-red-500 fill-current" : "text-gray-600"
                  }`}
                />
              </button>

              {/* Bottom overlay with key info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span className="text-xs sm:text-sm font-semibold">
                        {item.rating || "4.5"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {item.price}{" "}
                      <span className="text-sm sm:text-lg text-gray-200">
                        Rs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6">
                {/* Title and Restaurant */}
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {item.name}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-2 sm:mb-3">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base sm:text-lg">
                      {item.restaurant}
                    </span>
                  </div>
                  <div className="flex items-center text-sm sm:text-base text-gray-500">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>
                      {item.prepTime || "15-20 min"} • {item.calories || "320"}{" "}
                      cal
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    {item.description ||
                      "A delicious and carefully prepared dish made with fresh, high-quality ingredients. Perfect for any time of the day when you want something special and satisfying."}
                  </p>
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  {/* Ingredients */}
                  {item.ingredients && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                        Ingredients
                      </h3>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {item.ingredients.map((ingredient, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 sm:px-3 sm:py-1 bg-orange-100 text-orange-800 text-xs sm:text-sm rounded-full font-medium"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dietary Information */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                      Dietary Info
                    </h3>
                    <div className="space-y-1 sm:space-y-2">
                      {item.isGlutenFree && (
                        <div className="flex items-center text-blue-700 text-sm sm:text-base">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2 sm:mr-3"></div>
                          Gluten Free
                        </div>
                      )}
                      {item.isVegan && (
                        <div className="flex items-center text-green-700 text-sm sm:text-base">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full mr-2 sm:mr-3"></div>
                          Vegan
                        </div>
                      )}
                      {item.isLactoseFree && (
                        <div className="flex items-center text-purple-700 text-sm sm:text-base">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full mr-2 sm:mr-3"></div>
                          Lactose Free
                        </div>
                      )}
                      {item.isOrganic && (
                        <div className="flex items-center text-green-700 text-sm sm:text-base">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full mr-2 sm:mr-3"></div>
                          Organic
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nutritional Information */}
                {item.nutritionalInfo && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                      Nutrition Facts
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      {Object.entries(item.nutritionalInfo).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="text-center p-2 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl"
                          >
                            <div className="text-xs sm:text-sm text-gray-500 capitalize font-medium">
                              {key}
                            </div>
                            <div className="text-base sm:text-lg font-bold text-gray-900 mt-0.5 sm:mt-1">
                              {value}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Footer with quantity and add to cart */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              {/* Enhanced Date Picker for Calendar Planning */}
              {showDatePicker && availableDates.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Select Date for Meal Planning
                  </h3>
                  <div className="max-h-40 sm:max-h-48 overflow-y-auto custom-scrollbar border border-gray-200 rounded-lg p-2 sm:p-3 bg-white">
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 sm:gap-2">
                      {availableDates.map((date) => {
                        const dateStr = date.toDateString();
                        const isSelected = selectedDate === dateStr;
                        const isToday =
                          date.toDateString() === new Date().toDateString();
                        const isPast = date < new Date().setHours(0, 0, 0, 0);

                        return (
                          <button
                            key={dateStr}
                            onClick={() => setSelectedDate(dateStr)}
                            disabled={isPast}
                            className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[50px] sm:min-h-[60px] flex flex-col items-center justify-center ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-lg transform scale-105"
                                : isToday
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border-2 border-amber-300"
                                : isPast
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                                : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-transparent hover:border-blue-200"
                            }`}
                          >
                            <div className="text-xs font-medium">
                              {isMobile
                                ? date.toLocaleDateString("en-US", {
                                    weekday: "narrow",
                                  })
                                : date.toLocaleDateString("en-US", {
                                    weekday: "short",
                                  })}
                            </div>
                            <div className="text-sm sm:text-lg font-bold">
                              {date.getDate()}
                            </div>
                            {isToday && (
                              <div className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 opacity-75">
                                Today
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {selectedDate && (
                    <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs sm:text-sm text-blue-800 font-medium">
                        Selected:{" "}
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: isMobile ? "short" : "long",
                          month: isMobile ? "short" : "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
                {/* Quantity selector */}
                <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                  <span className="text-base sm:text-lg font-semibold text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border-2 border-orange-200 rounded-lg sm:rounded-xl bg-white">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 sm:p-3 hover:bg-orange-50 text-orange-600 transition-colors rounded-l-lg sm:rounded-l-xl"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3 sm:w-5 sm:h-5" />
                    </button>
                    <span className="px-3 sm:px-6 py-1 sm:py-3 font-bold text-lg sm:text-xl text-gray-900 min-w-[60px] sm:min-w-[80px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="p-2 sm:p-3 hover:bg-orange-50 text-orange-600 transition-colors rounded-r-lg sm:rounded-r-xl"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Add to cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || (showDatePicker && !selectedDate)}
                  className={`w-full sm:flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg text-white transition-all duration-300 ${
                    isAdding
                      ? "bg-green-600 cursor-not-allowed"
                      : showDatePicker && !selectedDate
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6" />
                      <span>
                        {showDatePicker
                          ? selectedDate
                            ? `Plan for ${new Date(
                                selectedDate
                              ).toLocaleDateString("en-US", {
                                month: isMobile ? "short" : "long",
                                day: "numeric",
                              })}`
                            : "Select Date"
                          : `Add ${quantity} to Cart`}{" "}
                        • {(item.price * quantity).toFixed(0)} DKK
                      </span>
                    </>
                  )}
                </button>
              </div>

              {showDatePicker && !selectedDate && (
                <p className="text-xs sm:text-sm text-amber-600 mt-2 text-center font-medium">
                  Please select a date to add this meal to your calendar plan
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FoodItemModal;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Leaf, Award, AlertCircle } from "lucide-react";

const ProfessionalFoodCard = ({
  food,
  onDragStart,
  onDragEnd,
  onClick,
  compact = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Determine meal type for color coding
  const getMealType = () => {
    if (!food.isAvailable) return "unavailable";
    if (food.isVegan || food.isVegetarian) return "vegetarian";
    if (food.chefSpecial || food.isPopular) return "special";
    return "regular";
  };

  const mealType = getMealType();

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(food);
    }
  };

  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(e, food);
    }
  };

  const handleDragEnd = () => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <motion.div
      className={`food-item-card-professional ${mealType} group relative ${
        compact ? "compact" : ""
      }`}
      draggable={food.isAvailable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${food.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      {/* Availability Overlay */}
      {!food.isAvailable && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
          <div className="text-center">
            <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
            <span className="text-sm font-medium text-red-600">
              Out of Stock
            </span>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden rounded-lg mb-3 aspect-video">
        {!imageError ? (
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {food.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-gray-500">No Image</span>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {food.isVegan && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Vegan
            </span>
          )}
          {food.chefSpecial && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Award className="w-3 h-3" />
              Special
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs font-medium text-gray-700">
            {food.rating || "4.5"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Title and Restaurant */}
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
            {food.name}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-1">
            {food.restaurant}
          </p>
        </div>

        {/* Description */}
        {!compact && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {food.description ||
              "Delicious and carefully prepared with fresh ingredients."}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{food.prepTime || "15-20 min"}</span>
          </div>
          <span>{food.calories || "320"} cal</span>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-gray-900">{food.price}</span>
            <span className="text-xs text-gray-500">Rs</span>
          </div>

          <button
            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e);
            }}
          >
            View Details
          </button>
        </div>

        {/* Dietary Tags */}
        {!compact && (
          <div className="flex flex-wrap gap-1 pt-1">
            {food.isGlutenFree && (
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                Gluten-Free
              </span>
            )}
            {food.isLactoseFree && (
              <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">
                Lactose-Free
              </span>
            )}
            {food.isOrganic && (
              <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-xs rounded">
                Organic
              </span>
            )}
          </div>
        )}
      </div>

      {/* Click Hint */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          Click for details
        </div>
      </div>
    </motion.div>
  );
};

export default ProfessionalFoodCard;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Utensils,
} from "lucide-react";

const ProfessionalMealIndicator = ({
  meals = [],
  maxVisible = 3,
  expanded = false,
  compact = false,
  onRemove,
  onUpdateQty,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  if (!meals || meals.length === 0) return null;

  const visibleMeals = isExpanded ? meals : meals.slice(0, maxVisible);
  const hiddenCount = meals.length - maxVisible;

  const getMealTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "vegetarian":
      case "vegan":
        return "bg-green-100 text-green-800 border-green-200";
      case "special":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "premium":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (compact) {
    return (
      <div className="space-y-1">
        {visibleMeals.map((meal, index) => (
          <motion.div
            key={`${meal.food.id}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-1.5 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                <img
                  src={meal.food.imageUrl}
                  alt={meal.food.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=50&h=50&fit=crop&auto=format";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {meal.food.name}
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">×{meal.qty}</span>
                  {meal.food.price && (
                    <span className="text-xs text-gray-500">
                      • {(meal.food.price * meal.qty).toFixed(0)} Rs
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateQty?.(meal.food.id, meal.qty - 1);
                }}
                className="p-1 text-gray-400 hover:text-red-500 rounded"
                disabled={meal.qty <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateQty?.(meal.food.id, meal.qty + 1);
                }}
                className="p-1 text-gray-400 hover:text-green-500 rounded"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(meal.food.id);
                }}
                className="p-1 text-gray-400 hover:text-red-500 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}

        {hiddenCount > 0 && !isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="w-full py-1 text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center space-x-1 border-t border-dashed border-gray-200"
          >
            <ChevronDown className="w-3 h-3" />
            <span>+{hiddenCount} more</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {visibleMeals.map((meal, index) => (
          <motion.div
            key={`${meal.food.id}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all group"
          >
            {/* Meal Image */}
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={meal.food.imageUrl}
                alt={meal.food.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&auto=format";
                }}
              />
            </div>

            {/* Meal Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {meal.food.name}
                </h4>
                <span
                  className={`px-1.5 py-0.5 text-xs font-medium rounded-full border ${getMealTypeColor(
                    meal.food.type
                  )}`}
                >
                  {meal.food.type || "Regular"}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Utensils className="w-3 h-3" />
                  <span>Qty: {meal.qty}</span>
                </div>
                {meal.food.price && (
                  <div className="flex items-center space-x-1">
                    <span>•</span>
                    <span className="font-medium text-green-600">
                      {(meal.food.price * meal.qty).toFixed(0)} Rs
                    </span>
                  </div>
                )}
                {meal.food.prepTime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{meal.food.prepTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center bg-gray-100 rounded-full">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateQty?.(meal.food.id, meal.qty - 1);
                  }}
                  className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  disabled={meal.qty <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>

                <span className="px-2 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                  {meal.qty}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateQty?.(meal.food.id, meal.qty + 1);
                  }}
                  className="p-1.5 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(meal.food.id);
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Expand/Collapse Button */}
      {hiddenCount > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>Show {hiddenCount} More</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ProfessionalMealIndicator;

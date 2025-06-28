import React from 'react';
import { motion } from 'framer-motion';

const MealIndicator = ({ meals, maxVisible = 3 }) => {
  if (!meals || meals.length === 0) return null;

  // Group meals by unique food items
  const uniqueMeals = meals.reduce((acc, meal) => {
    const existing = acc.find(m => m.food.id === meal.food.id);
    if (existing) {
      existing.totalQty += meal.qty;
    } else {
      acc.push({ ...meal, totalQty: meal.qty });
    }
    return acc;
  }, []);

  const totalCount = meals.reduce((sum, meal) => sum + meal.qty, 0);
  const visibleMeals = uniqueMeals.slice(0, maxVisible);
  const remainingCount = Math.max(0, uniqueMeals.length - maxVisible);

  // Color palette for different meals
  const colors = [
    'bg-orange-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500'
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visibleMeals.map((meal, index) => (
        <motion.div
          key={meal.food.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 400 }}
          className="relative group"
        >
          {/* Meal Avatar */}
          <div className={`w-6 h-6 rounded-full border-2 border-white shadow-sm overflow-hidden ${colors[index % colors.length]} flex items-center justify-center`}>
            <img
              src={meal.food.imageUrl}
              alt={meal.food.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to colored circle with first letter
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center text-white text-xs font-bold">
              {meal.food.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Quantity Badge */}
          {meal.totalQty > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border border-white shadow-sm"
            >
              {meal.totalQty > 9 ? '9+' : meal.totalQty}
            </motion.div>
          )}

          {/* Tooltip */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
              {meal.food.name} × {meal.totalQty}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Remaining Count Indicator */}
      {remainingCount > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: maxVisible * 0.1, type: "spring", stiffness: 400 }}
          className="w-6 h-6 bg-gray-400 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm"
        >
          +{remainingCount}
        </motion.div>
      )}

      {/* Dietary Indicators */}
      <div className="ml-1 flex gap-0.5">
        {uniqueMeals.some(m => m.food.isVegan) && (
          <div className="w-2 h-2 bg-green-400 rounded-full" title="Vegan options available" />
        )}
        {uniqueMeals.some(m => m.food.isGlutenFree) && (
          <div className="w-2 h-2 bg-blue-400 rounded-full" title="Gluten-free options available" />
        )}
        {uniqueMeals.some(m => m.food.isKeto) && (
          <div className="w-2 h-2 bg-purple-400 rounded-full" title="Keto options available" />
        )}
      </div>
    </div>
  );
};

export default MealIndicator;

import React from 'react';
import { motion } from 'framer-motion';

const ProfessionalMealIndicator = ({ meals, maxVisible = 4 }) => {
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

  const visibleMeals = uniqueMeals.slice(0, maxVisible);
  const remainingCount = Math.max(0, uniqueMeals.length - maxVisible);

  // Determine meal type for color coding
  const getMealType = (meal) => {
    if (!meal.food.isAvailable) return 'unavailable';
    if (meal.food.isVegan || meal.food.isVegetarian) return 'vegetarian';
    if (meal.food.chefSpecial || meal.food.isPopular) return 'special';
    return 'regular';
  };

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      {visibleMeals.map((meal, index) => {
        const mealType = getMealType(meal);
        
        return (
          <motion.div
            key={meal.food.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: index * 0.1, 
              type: "spring", 
              stiffness: 400,
              damping: 10
            }}
            className="relative group"
          >
            {/* Meal Avatar */}
            <div className={`meal-indicator-professional type-${mealType}`}>
              <img
                src={meal.food.imageUrl}
                alt={meal.food.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to colored circle with first letter
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  if (parent && !parent.querySelector('.fallback-letter')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'fallback-letter w-full h-full flex items-center justify-center text-white text-xs font-bold';
                    fallback.textContent = meal.food.name.charAt(0).toUpperCase();
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>

            {/* Quantity Badge */}
            {meal.totalQty > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                className="quantity-badge"
              >
                {meal.totalQty > 9 ? '9+' : meal.totalQty}
              </motion.div>
            )}

            {/* Enhanced Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
              <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg border border-gray-700">
                <div className="font-medium">{meal.food.name}</div>
                <div className="text-gray-300">
                  Quantity: {meal.totalQty} • {meal.food.price} DKK each
                </div>
                <div className="text-gray-400 text-xs">
                  {meal.food.restaurant}
                </div>
                
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-gray-900"></div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Remaining Count Indicator */}
      {remainingCount > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: maxVisible * 0.1, 
            type: "spring", 
            stiffness: 400 
          }}
          className="meal-indicator-professional bg-gray-400 flex items-center justify-center text-white text-xs font-bold"
        >
          +{remainingCount}
        </motion.div>
      )}

      {/* Dietary Indicators */}
      <div className="ml-2 flex gap-1">
        {uniqueMeals.some(m => m.food.isVegan) && (
          <div 
            className="w-2 h-2 bg-green-500 rounded-full" 
            title="Vegan options available"
          />
        )}
        {uniqueMeals.some(m => m.food.isGlutenFree) && (
          <div 
            className="w-2 h-2 bg-blue-500 rounded-full" 
            title="Gluten-free options available"
          />
        )}
        {uniqueMeals.some(m => m.food.isOrganic) && (
          <div 
            className="w-2 h-2 bg-emerald-500 rounded-full" 
            title="Organic options available"
          />
        )}
      </div>
    </div>
  );
};

export default ProfessionalMealIndicator;

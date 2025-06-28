import React from 'react';
import { Leaf, Award, Clock, AlertCircle } from 'lucide-react';

const ColorLegend = ({ showTooltip = false }) => {
  const legendItems = [
    {
      type: 'regular',
      color: 'rgb(37, 99, 235)', // blue-600
      label: 'Regular Meals',
      icon: Clock,
      description: 'Standard menu items'
    },
    {
      type: 'vegetarian',
      color: 'rgb(16, 185, 129)', // emerald-500
      label: 'Vegetarian/Vegan',
      icon: Leaf,
      description: 'Plant-based options'
    },
    {
      type: 'special',
      color: 'rgb(245, 158, 11)', // amber-500
      label: "Chef's Specials",
      icon: Award,
      description: 'Featured and signature dishes'
    },
    {
      type: 'unavailable',
      color: 'rgb(239, 68, 68)', // red-500
      label: 'Out of Stock',
      icon: AlertCircle,
      description: 'Currently unavailable'
    }
  ];

  return (
    <div className="color-legend">
      <div className="flex items-center gap-2 mr-4">
        <span className="text-sm font-medium text-gray-700">Meal Types:</span>
      </div>
      
      {legendItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <div 
            key={item.type} 
            className="legend-item group relative"
          >
            <div 
              className="legend-dot"
              style={{ backgroundColor: item.color }}
            />
            <IconComponent className="w-3 h-3" style={{ color: item.color }} />
            <span>{item.label}</span>
            
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ColorLegend;

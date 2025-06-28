"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Utensils, Search, Loader2, AlertCircle } from "lucide-react";

const Recommendations = () => {
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState("delhi");

  const cities = [
    { value: "delhi", label: "Delhi", emoji: "🏛️" },
    { value: "pune", label: "Pune", emoji: "🏔️" },
    { value: "mumbai", label: "Mumbai", emoji: "🏙️" },
    { value: "chennai", label: "Chennai", emoji: "🏖️" },
    { value: "bangalore", label: "Bangalore", emoji: "🌳" }
  ];

  const fetchRecommendations = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/recommend1?city=${city}`);
      if (!response.ok) throw new Error("API failed");
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setDishes(data);
      } else {
        setError("No recommendations found for this city");
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      setError("Failed to load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(selectedCity);
  }, [selectedCity]);

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleOrderNow = (food) => {
    // You can implement your order logic here
    alert(`Ordering ${food}...`);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Culinary Discoveries
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover authentic local flavors and hidden gems from across India's vibrant food scene
          </p>
        </div>

        {/* City Selector */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">Choose Your City</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {cities.map((city) => (
              <button
                key={city.value}
                onClick={() => handleCityChange(city.value)}
                className={`relative overflow-hidden rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  selectedCity === city.value
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-white hover:bg-orange-50 text-gray-700 border-2 border-gray-100 hover:border-orange-200"
                }`}
              >
                <div className="text-2xl mb-1">{city.emoji}</div>
                <div className="font-medium">{city.label}</div>
                {selectedCity === city.value && (
                  <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-5 h-5 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              Recommended Dishes from {cities.find(c => c.value === selectedCity)?.label}
            </h2>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Discovering delicious recommendations...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <h3 className="font-semibold text-red-800">Oops!</h3>
                </div>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => fetchRecommendations(selectedCity)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && dishes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dishes.map(({ food, image }, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=focalpoint&auto=format&q=60"}
                      alt={food}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=focalpoint&auto=format&q=60";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                      {food}
                    </h3>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {cities.find(c => c.value === selectedCity)?.label}
                    </div>
                    <button
                      onClick={() => handleOrderNow(food)}
                      className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      Order Now
                    </button>
                  </div>
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <span className="text-sm font-medium text-orange-600">Try Me!</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && dishes.length === 0 && (
            <div className="text-center py-16">
              <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No recommendations available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
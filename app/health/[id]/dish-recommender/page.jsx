"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HeartPulse,
  Clock,
  Cloud,
  Smile,
  Loader2,
  Sun,
  Moon,
  Coffee,
  Utensils,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const DishRecommender = () => {
  const { id } = useParams();
  const customerId = id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [formData, setFormData] = useState({ city: "" });

  const getRecommendations = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/dishrecommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          currentMood: "Happy",
          city: formData.city,
        }),
      });
      if (!response.ok) throw new Error("Failed to get recommendations");
      const data = await response.json();
      setRecommendations(data);
      toast.success("Recommendations generated!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getRecommendations();
  }, []);

  const getTimeIcon = () => {
    if (!recommendations) return null;
    switch (recommendations.timeContext) {
      case "morning":
        return <Sun className="text-yellow-500" />;
      case "afternoon":
        return <Utensils className="text-orange-500" />;
      case "evening":
        return <Coffee className="text-amber-700" />;
      case "night":
        return <Moon className="text-indigo-500" />;
      default:
        return <Clock className="text-orange-500" />;
    }
  };

  // Updated parsing to correctly extract 'Meal Name', 'Why it's suitable', and 'Past Order Relation'
  const parseRecommendation = (rec) => {
    if (!rec) return { name: "", why: "", relation: "" };

    const nameMatch = rec.match(/\*Meal Name:\*\*\s*([^*]+)/i);
    const whyMatch = rec.match(/\*Why it's suitable:\*\s*([^*]+)/i);
    const relationMatch =
      rec.match(/\*Past Order Relation:\*\s*([^*]+)/i) ||
      rec.match(/\*Relation to past orders:\*\s*([^*]+)/i);

    return {
      name: nameMatch ? nameMatch[1].trim() : "",
      why: whyMatch ? whyMatch[1].trim() : "",
      relation: relationMatch ? relationMatch[1].trim() : "",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <HeartPulse className="text-orange-500 mr-3" size={28} />
          <h1 className="text-3xl font-bold text-gray-800">Dish Recommender</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Get personalized meal recommendations based on the time of day,
          weather, and your past orders.
        </p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Want weather-specific recommendations?
            </h2>
            <form onSubmit={getRecommendations}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Location (optional)
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="E.g. New York"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Providing your location helps us consider weather in our
                    recommendations
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Regenerating...
                    </>
                  ) : (
                    "Update Recommendations"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {recommendations && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {getTimeIcon()}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {recommendations.timeContext.charAt(0).toUpperCase() +
                        recommendations.timeContext.slice(1)}{" "}
                      Recommendations
                    </h2>
                    {recommendations.weather && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <Cloud className="mr-1" size={16} />
                        {recommendations.weather.temp}°C,{" "}
                        {recommendations.weather.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {recommendations.timeBasedRecommendations.map(
                    (rec, index) => {
                      const { name, why, relation } = parseRecommendation(rec);
                      return (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-orange-100 p-2 rounded-full group-hover:bg-orange-200 transition-colors">
                              <Utensils className="text-orange-500" size={18} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800">
                                {name}
                              </h3>
                              {why && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">
                                    Why it’s suitable:
                                  </p>
                                  <p className="text-gray-600 text-sm mt-1">
                                    {why}
                                  </p>
                                </div>
                              )}
                              {relation && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">
                                    Past Order Relation:
                                  </p>
                                  <p className="text-gray-600 text-sm mt-1">
                                    {relation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {recommendations.moodComfortFood && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Smile className="text-orange-500" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Happiness Booster
                    </h2>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <HeartPulse className="text-orange-500" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {recommendations.moodComfortFood
                            .replace(/\*Meal Name:\*/i, "")
                            .trim()}
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          A perfect comfort food to boost your happy mood!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DishRecommender;

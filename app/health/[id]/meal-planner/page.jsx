"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronDown, Loader2 } from "lucide-react";

const MealPlanner = () => {
  const { customerId } = useParams();
  const [formData, setFormData] = useState({
    goal: "",
    dietaryPreferences: "",
    allergies: "",
    cuisinePreferences: "",
    days: 7,
  });
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [error, setError] = useState("");

  const healthGoals = [
    "weight-loss",
    "muscle-gain",
    "maintenance",
    "diabetic",
    "heart-healthy",
  ];

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Pescatarian",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Paleo",
    "Low-Carb",
    "Mediterranean",
  ];

  const cuisineOptions = [
    "Italian",
    "Mexican",
    "Asian",
    "Indian",
    "Mediterranean",
    "American",
    "Japanese",
    "Thai",
    "Middle Eastern",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMealPlan(null);

    if (!formData.goal) {
      toast.error("Please select a health goal");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/meal-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate meal plan");
      }

      setMealPlan(data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Personalized Meal Planner
      </h1>
      <p className="text-gray-600 mb-8">
        Get a customized meal plan tailored to your health goals and dietary
        needs
      </p>

      <form onSubmit={handleSubmit} className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Goal */}
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Health Goal *
            </label>
            <div className="relative">
              <select
                id="goal"
                name="goal"
                required
                value={formData.goal}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select your health goal</option>
                {healthGoals.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Days */}
          <div>
            <label
              htmlFor="days"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Plan Duration (days)
            </label>
            <input
              type="number"
              id="days"
              name="days"
              min="1"
              max="14"
              value={formData.days}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Dietary Preferences */}
          <div>
            <label
              htmlFor="dietaryPreferences"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Dietary Preferences
            </label>
            <div className="relative">
              <select
                id="dietaryPreferences"
                name="dietaryPreferences"
                value={formData.dietaryPreferences}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select preferences</option>
                {dietaryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Cuisine Preferences */}
          <div>
            <label
              htmlFor="cuisinePreferences"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cuisine Preferences
            </label>
            <div className="relative">
              <select
                id="cuisinePreferences"
                name="cuisinePreferences"
                value={formData.cuisinePreferences}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select cuisine</option>
                {cuisineOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="md:col-span-2">
            <label
              htmlFor="allergies"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Allergies or Restrictions (comma separated)
            </label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., nuts, shellfish, dairy"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full md:w-auto px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" size={20} />
              Creating Your Plan...
            </span>
          ) : (
            "Generate Meal Plan"
          )}
        </button>
      </form>

      {mealPlan && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Your {mealPlan.days}-Day Meal Plan
              </h2>
              <p className="text-gray-600">
                Designed for:{" "}
                <span className="font-medium capitalize">
                  {mealPlan.goal.replace(/-/g, " ")}
                </span>
              </p>
            </div>
            {mealPlan.mealPlan?.summary && (
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                {mealPlan.mealPlan.summary.averageDailyCalories ||
                  "Calorie range not specified"}
              </div>
            )}
          </div>

          {mealPlan.mealPlan?.summary?.keyFeatures && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-700 mb-2">
                Key Features:
              </h3>
              <div className="flex flex-wrap gap-2">
                {mealPlan.mealPlan.summary.keyFeatures.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-white px-3 py-1 rounded-full text-sm border border-orange-200"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {mealPlan.mealPlan?.days ? (
            <div className="space-y-8">
              {mealPlan.mealPlan.days.map((day) => (
                <div
                  key={day.dayNumber}
                  className="border-b border-gray-200 pb-8 last:border-0"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Day {day.dayNumber}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {day.meals.map((meal, index) => (
                      <div
                        key={index}
                        className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-800 capitalize">
                            {meal.mealType}
                          </h4>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {meal.calories || "?"} kcal
                          </span>
                        </div>

                        <h5 className="text-lg font-bold text-orange-600 mb-2">
                          {meal.name}
                        </h5>
                        <p className="text-gray-700 mb-4">{meal.description}</p>

                        <div className="mb-4">
                          <h6 className="font-medium text-gray-700 mb-2">
                            Macros:
                          </h6>
                          <div className="flex gap-4">
                            <div className="text-center">
                              <div className="text-sm text-gray-600">
                                Protein
                              </div>
                              <div className="font-bold">
                                {meal.macros?.protein || "?"}g
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Carbs</div>
                              <div className="font-bold">
                                {meal.macros?.carbs || "?"}g
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Fats</div>
                              <div className="font-bold">
                                {meal.macros?.fats || "?"}g
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h6 className="font-medium text-gray-700 mb-2">
                            Ingredients:
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {meal.ingredients?.map((ingredient, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-50 px-2 py-1 rounded text-sm"
                              >
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>

                        {meal.preparationNotes && (
                          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700 border border-blue-100">
                            <span className="font-medium">Note: </span>
                            {meal.preparationNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">
                Meal plan details could not be loaded
              </p>
              {mealPlan.mealPlan?.error && (
                <p className="mt-2 text-sm text-gray-600">
                  {mealPlan.mealPlan.error}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            <p className="font-medium">Disclaimer:</p>
            <p>{mealPlan.disclaimer}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <p className="text-red-700 font-medium">⚠️ {error}</p>
          <p className="mt-2 text-red-600">
            Please try adjusting your inputs or try again later.
          </p>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;

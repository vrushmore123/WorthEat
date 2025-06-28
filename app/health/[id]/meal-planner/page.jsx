// components/MealPlanner.jsx
"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, Loader2 } from "lucide-react";

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

export default function MealPlanner() {
  const [formData, setFormData] = useState({
    goal: "",
    dietaryPreferences: "",
    allergies: "",
    cuisinePreferences: "",
    days: 7,
  });
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.goal) {
      toast.error("Please select a health goal");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/meal-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API Error");
      console.log("Food Details:", data);
      setResponseData(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const daysData = responseData?.mealPlan?.mealPlan?.days;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2">Personalized Meal Planner</h1>
      <p className="text-gray-600 mb-8">
        Get a customized meal plan tailored to your goals and preferences.
      </p>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Health Goal */}
        <div>
          <label htmlFor="goal" className="block mb-2">
            Health Goal *
          </label>
          <div className="relative">
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg appearance-none"
              required
            >
              <option value="">Select goal</option>
              {healthGoals.map((g) => (
                <option key={g} value={g}>
                  {g.replace(/-/g, " ")}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="days" className="block mb-2">
            Duration (days)
          </label>
          <input
            type="number"
            id="days"
            name="days"
            min={1}
            max={14}
            value={formData.days}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Dietary */}
        <div>
          <label htmlFor="dietaryPreferences" className="block mb-2">
            Dietary Preferences
          </label>
          <div className="relative">
            <select
              id="dietaryPreferences"
              name="dietaryPreferences"
              value={formData.dietaryPreferences}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg appearance-none"
            >
              <option value="">Select preference</option>
              {dietaryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown />
            </div>
          </div>
        </div>

        {/* Cuisine */}
        <div>
          <label htmlFor="cuisinePreferences" className="block mb-2">
            Cuisine Preferences
          </label>
          <div className="relative">
            <select
              id="cuisinePreferences"
              name="cuisinePreferences"
              value={formData.cuisinePreferences}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg appearance-none"
            >
              <option value="">Select cuisine</option>
              {cuisineOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown />
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div className="md:col-span-2">
          <label htmlFor="allergies" className="block mb-2">
            Allergies & Restrictions
          </label>
          <input
            type="text"
            id="allergies"
            name="allergies"
            placeholder="e.g., nuts, dairy"
            value={formData.allergies}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Generating...
            </>
          ) : (
            "Generate Meal Plan"
          )}
        </button>
      </form>

      {responseData && (
        <section className="space-y-6">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Your {responseData.days || formData.days}-Day Plan
            </h2>
            <div className="px-3 py-1 bg-orange-100 rounded-full text-orange-800 capitalize">
              {responseData.goal ? responseData.goal.replace(/-/g, " ") : "N/A"}
            </div>
          </header>

          {responseData.dietaryPreferences && (
            <div className="mb-6">
              <span className="px-3 py-1 bg-orange-50 rounded-full text-orange-800">
                {responseData.dietaryPreferences}
              </span>
            </div>
          )}

          {Array.isArray(daysData) && daysData.length > 0 ? (
            <div className="space-y-8">
              {daysData.map((day) => (
                <div key={day.day} className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {day.day}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {day.meals.map((meal, idx) => (
                      <article
                        key={idx}
                        className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <span className="block text-sm font-medium text-orange-600 mb-1">
                          {meal.meal}
                        </span>
                        <h4 className="font-bold text-gray-800">
                          {meal.food || meal.dish}
                        </h4>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No meal data available for the selected duration.
            </p>
          )}

          <p className="text-sm text-gray-500 mt-8">
            {responseData.disclaimer}
          </p>
        </section>
      )}
    </div>
  );
}

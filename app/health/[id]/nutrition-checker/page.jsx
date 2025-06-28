"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronDown, Loader2 } from "lucide-react";

const ProteinPlanner = () => {
  const { customerId } = useParams();
  const [proteinGoal, setProteinGoal] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const dietaryOptions = [
    "None",
    "Vegetarian",
    "Vegan",
    "Pescatarian",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Paleo",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!proteinGoal) {
      toast.error("Please enter your protein goal");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proteinGoal: parseInt(proteinGoal),
          dietaryPreference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate suggestions");
      }

      setResult(data);
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
        Protein Meal Planner
      </h1>
      <p className="text-gray-600 mb-8">
        Get personalized high-protein meal suggestions based on your goals
      </p>

      <form onSubmit={handleSubmit} className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="proteinGoal"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Protein Goal (grams per meal)
            </label>
            <input
              type="number"
              id="proteinGoal"
              min="1"
              max="100"
              required
              value={proteinGoal}
              onChange={(e) => setProteinGoal(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., 30"
            />
          </div>

          <div>
            <label
              htmlFor="dietaryPreference"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Dietary Preference
            </label>
            <div className="relative">
              <select
                id="dietaryPreference"
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select preference</option>
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
              Generating Suggestions...
            </span>
          ) : (
            "Generate Meal Plan"
          )}
        </button>
      </form>

      {result?.proteinFact && (
        <div className="mb-8 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
          <p className="text-orange-700 font-medium">
            ✨ Protein Fact: {result.proteinFact}
          </p>
        </div>
      )}

      {result?.suggestions && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Protein-Packed Meal Suggestions
          </h2>
          <div className="prose prose-orange max-w-none">
            {result.suggestions.split("\n").map((line, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <p className="text-red-700 font-medium">⚠️ {error}</p>
          {result?.proteinFact && (
            <p className="mt-2 text-red-600">
              But here's a fun fact: {result.proteinFact}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProteinPlanner;

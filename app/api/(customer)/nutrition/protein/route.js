import { NextResponse } from "next/server";
import axios from "axios";

// Common Indian dishes nutrition data (simplified)
const NUTRITION_DB = {
  pavbhaji: {
    baseIngredients: [
      "potatoes",
      "cauliflower",
      "peas",
      "tomatoes",
      "butter",
      "pav bread",
    ],
    typicalServing: {
      calories: 450,
      protein: 12,
      carbs: 60,
      fat: 18,
      fiber: 8,
    },
  },
  biryani: {
    baseIngredients: ["rice", "chicken", "yogurt", "spices", "ghee"],
    typicalServing: {
      calories: 600,
      protein: 30,
      carbs: 80,
      fat: 20,
      fiber: 5,
    },
  },
  dosa: {
    baseIngredients: ["rice batter", "lentils", "oil"],
    typicalServing: {
      calories: 350,
      protein: 8,
      carbs: 50,
      fat: 12,
      fiber: 6,
    },
  },
};

export async function POST(req) {
  try {
    const { food, servingSize } = await req.json();

    if (!food) {
      return NextResponse.json(
        { error: "Please specify a food item" },
        { status: 400 }
      );
    }

    const normalizedFood = food.toLowerCase();
    const serving = servingSize || "a typical serving";

    // First try to get data from our local DB
    const localFoodData = NUTRITION_DB[normalizedFood];

    // Prepare the AI prompt based on whether we have local data
    const prompt = localFoodData
      ? createPromptWithLocalData(normalizedFood, localFoodData, serving)
      : createPromptForUnknownFood(normalizedFood, serving);

    // Call Gemini API
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1500,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Parse the AI response to extract structured data if possible
    const result = {
      food: normalizedFood,
      analysis: aiResponse || "Analysis not available",
    };

    // If we had local data, include that too
    if (localFoodData) {
      result.nutritionFacts = localFoodData.typicalServing;
      result.funFact = `Did you know? ${normalizedFood} originated in ${getFoodOrigin(
        normalizedFood
      )}!`;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Nutrition analysis error:", error);
    return NextResponse.json(
      {
        error: "Nutrition analysis failed",
        details: error.message,
        suggestion:
          "Try specifying the food more clearly (e.g., 'chicken biryani' instead of 'biryani')",
      },
      { status: 500 }
    );
  }
}

// Helper function to create prompt when we have local nutrition data
function createPromptWithLocalData(food, foodData, servingSize) {
  return `
    Nutrition Expert Analysis for ${food}:
    
    Base Ingredients: ${foodData.baseIngredients?.join(", ") || "Unknown"}
    
    Nutrition Facts for ${servingSize}:
    - Calories: ${foodData.typicalServing.calories}kcal
    - Protein: ${foodData.typicalServing.protein}g
    - Carbohydrates: ${foodData.typicalServing.carbs}g
    - Fats: ${foodData.typicalServing.fat}g
    - Fiber: ${foodData.typicalServing.fiber}g
    
    Please provide a comprehensive analysis including:
    
    1. Macronutrient breakdown (percentage of calories from protein, carbs, fats)
    2. 3-5 key health benefits of consuming this food
    3. 2-3 potential health considerations (allergies, high sodium, etc.)
    4. 3 ways to prepare or consume this food for maximum health benefits
    5. Complementary foods that would create a balanced meal
    6. Vitamin and mineral content (even if not in the provided data)
    
    For each point, provide brief explanations suitable for a general audience.
    Format your response with clear markdown headings (##) and bullet points.
  `;
}

// Helper function to create prompt for unknown foods
function createPromptForUnknownFood(food, servingSize) {
  return `
    You are a nutrition expert analyzing ${food}. Since we don't have specific data, 
    provide a general analysis based on typical preparation methods and ingredients.
    
    Please include:
    
    1. Estimated macronutrient profile for ${servingSize} (calories, protein, carbs, fats)
    2. Common ingredients and their nutritional contributions
    3. 3-5 potential health benefits
    4. 2-3 health considerations
    5. Variations of this dish across different cuisines
    6. How to make healthier versions
    7. Typical vitamin and mineral content
    
    If this is a composite dish (like pizza or salad), explain how different components 
    affect the nutritional profile. For ambiguous items, consider the most common preparation.
    
    Format your response with clear markdown headings (##) and bullet points.
    If you're uncertain about something, please indicate that.
  `;
}

// Helper function (keep your existing one)
function getFoodOrigin(dish) {
  const origins = {
    pavbhaji: "Mumbai in the 1850s as a quick lunch for textile workers",
    biryani: "the Mughal Empire's royal kitchens",
    dosa: "ancient South India over 2000 years ago",
  };
  return origins[dish] || "unknown origins";
}

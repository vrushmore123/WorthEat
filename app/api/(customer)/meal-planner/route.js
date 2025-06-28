import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const {
      goal,
      dietaryPreferences,
      allergies,
      cuisinePreferences,
      days = 7,
    } = await req.json();

    if (!goal) {
      return NextResponse.json(
        {
          error:
            "Please specify a health goal (weight-loss, muscle-gain, maintenance)",
        },
        { status: 400 }
      );
    }

    // Validate inputs
    const validGoals = [
      "weight-loss",
      "muscle-gain",
      "maintenance",
      "diabetic",
      "heart-healthy",
    ];
    if (!validGoals.includes(goal)) {
      return NextResponse.json(
        { error: "Invalid health goal. Choose from: " + validGoals.join(", ") },
        { status: 400 }
      );
    }

    // Create AI prompt
    const prompt = createMealPlanPrompt(
      goal,
      dietaryPreferences,
      allergies,
      cuisinePreferences,
      days
    );

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
          temperature: 0.5, // Lower for more consistent results
          topP: 0.9,
          maxOutputTokens: 2000,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Parse the response into structured data
    const parsedResponse = parseMealPlanResponse(aiResponse);

    return NextResponse.json({
      status: "success",
      goal,
      dietaryPreferences,
      days,
      mealPlan: parsedResponse,
      disclaimer:
        "Consult with a nutritionist for personalized advice. This is a general recommendation.",
    });
  } catch (error) {
    console.error("Meal planner error:", error);
    return NextResponse.json(
      {
        error: "Meal planning failed",
        details: error.message,
        suggestion: "Try simplifying your request or contact support",
      },
      { status: 500 }
    );
  }
}

function createMealPlanPrompt(
  goal,
  dietaryPreferences,
  allergies,
  cuisinePreferences,
  days
) {
  return `
    You are an expert nutritionist creating a ${days}-day meal plan for a food delivery app. 

    User Requirements:
    - Primary goal: ${goal}
    - Dietary preferences: ${dietaryPreferences || "none specified"}
    - Allergies: ${allergies || "none"}
    - Cuisine preferences: ${cuisinePreferences || "any"}

    Create a detailed meal plan with these sections for each day:
    1. Breakfast (approx. 300-400 calories for weight loss)
    2. Mid-morning snack (approx. 100-150 calories)
    3. Lunch (approx. 400-500 calories)
    4. Evening snack (approx. 100-150 calories)
    5. Dinner (approx. 400-450 calories)

    For each meal:
    - Provide a descriptive meal name
    - List main ingredients
    - Note approximate calories and macronutrients (protein, carbs, fats)
    - Include preparation notes if important
    - Suggest portion sizes

    Special Instructions:
    - Focus on whole foods and balanced nutrition
    - For weight loss: emphasize high protein, fiber, and volume foods
    - For muscle gain: increase protein portions and include recovery foods
    - Ensure meals can realistically be delivered (avoid foods that don't travel well)
    - Include variety to prevent boredom
    - Flag any potential allergens clearly

    Format the response in this exact JSON structure (only output the raw JSON):

    {
      "summary": {
        "totalDays": ${days},
        "averageDailyCalories": [range based on goal],
        "proteinFocus": [true/false],
        "keyFeatures": ["list", "of", "features"]
      },
      "days": [
        {
          "dayNumber": 1,
          "date": "optional",
          "meals": [
            {
              "mealType": "breakfast",
              "name": "Meal name",
              "description": "Brief description",
              "calories": 350,
              "macros": {
                "protein": 20,
                "carbs": 40,
                "fats": 10
              },
              "ingredients": ["list", "of", "ingredients"],
              "allergens": ["list", "if", "any"],
              "cuisineType": "type",
              "preparationNotes": "any special notes"
            },
            // ... other meals
          ]
        }
        // ... other days
      ]
    }
  `;
}

function parseMealPlanResponse(response) {
  try {
    // Try to parse the JSON directly
    const startIdx = response.indexOf("{");
    const endIdx = response.lastIndexOf("}");
    const jsonStr = response.slice(startIdx, endIdx + 1);
    return JSON.parse(jsonStr);
  } catch (e) {
    // Fallback to returning the raw response if parsing fails
    console.error("Failed to parse AI response:", e);
    return { error: "Could not parse meal plan", rawResponse: response };
  }
}

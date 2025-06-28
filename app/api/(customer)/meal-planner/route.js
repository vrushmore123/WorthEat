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
    [IMPORTANT INSTRUCTIONS]
    - You MUST respond with ONLY valid JSON output
    - Do NOT include any comments, explanations, or markdown formatting
    - Do NOT include any text outside the JSON structure
    - Do NOT use JavaScript-style comments (// or /* */)
    - The response must be parseable by JSON.parse() directly
    
    Create a ${days}-day meal plan with these specifications:
    - Primary goal: ${goal}
    - Dietary preferences: ${dietaryPreferences || "none specified"}
    - Allergies: ${allergies || "none"}
    - Cuisine preferences: ${cuisinePreferences || "any"}
    
    [REQUIRED FORMAT]
    {
      "summary": {
        "totalDays": ${days},
        "averageDailyCalories": "range based on goal",
        "proteinFocus": true/false,
        "keyFeatures": ["list", "of", "features"]
      },
      "days": [
        {
          "dayNumber": 1,
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
            }
          ]
        }
      ]
    }
  `;
}

function parseMealPlanResponse(response) {
  try {
    // First try to parse directly (in case response is pure JSON)
    try {
      return JSON.parse(response);
    } catch (e) {
      // If direct parse fails, try to extract JSON from text
      const jsonStart = response.indexOf("{");
      const jsonEnd = response.lastIndexOf("}");

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No JSON found in response");
      }

      const jsonStr = response.slice(jsonStart, jsonEnd + 1);

      // Remove any comments and other non-JSON content
      const cleanedJson = jsonStr
        .replace(/\/\/.*?\n/g, "") // Remove line comments
        .replace(/\/\*.*?\*\//g, "") // Remove block comments
        .trim();

      return JSON.parse(cleanedJson);
    }
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return {
      error: "Could not parse meal plan",
      rawResponse: response,
      parsingError: e.message,
    };
  }
}

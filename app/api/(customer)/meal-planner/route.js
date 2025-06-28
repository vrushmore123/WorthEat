// api/(customer)/meal-planner/route.js
import { NextResponse } from "next/server";
import axios from "axios";

// Configuration
const MAX_RETRIES = 2;
const INITIAL_TIMEOUT = 30000; // 30 seconds
const VALID_GOALS = [
  "weight-loss",
  "muscle-gain",
  "maintenance",
  "diabetic",
  "heart-healthy",
];

async function callGeminiAPI(prompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  let retries = 0;
  let timeout = INITIAL_TIMEOUT;

  while (retries <= MAX_RETRIES) {
    try {
      const response = await axios.post(
        url,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.5,
            topP: 0.9,
            maxOutputTokens: 3000,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: timeout,
        }
      );
      return response;
    } catch (error) {
      if (error.code === "ECONNABORTED" && retries < MAX_RETRIES) {
        retries++;
        timeout *= 1.5;
        console.warn(`Retry ${retries}/${MAX_RETRIES} after timeout`);
        continue;
      }
      throw error;
    }
  }
}

/**
 * Parses AI response text to extract the first complete JSON object
 */
function parseMealPlanResponse(text) {
  if (typeof text !== "string") {
    throw new Error("Invalid response type");
  }
  // Strip markdown fences
  let cleaned = text.replace(/```[\s\S]*?```/g, "").trim();

  // Find first '{'
  const startIdx = cleaned.indexOf("{");
  if (startIdx === -1) {
    throw new Error("No JSON object start found");
  }
  let braceCount = 0;
  let endIdx = -1;
  for (let i = startIdx; i < cleaned.length; i++) {
    if (cleaned[i] === "{") braceCount++;
    else if (cleaned[i] === "}") braceCount--;
    if (braceCount === 0) {
      endIdx = i;
      break;
    }
  }
  if (endIdx === -1) {
    throw new Error("No matching closing brace found");
  }
  const jsonString = cleaned.substring(startIdx, endIdx + 1);
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Parse JSON error:", err, jsonString);
    throw new Error("Invalid JSON format");
  }
}

/**
 * Builds the AI prompt for the meal plan
 */
function createMealPlanPrompt(
  goal,
  dietaryPreferences,
  allergies,
  cuisinePreferences,
  days
) {
  return `[IMPORTANT]\n- Respond with ONLY valid JSON\n- Do NOT include markdown or code blocks\n- Escape all special characters in strings\n- Ensure all quotes are double quotes\n\nCreate a ${days}-day meal plan with:\n- Goal: ${goal}\n- Diet: ${
    dietaryPreferences || "any"
  }\n- Allergies: ${allergies || "none"}\n- Cuisine: ${
    cuisinePreferences || "any"
  }\n`;
}

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
        { error: "Please specify a health goal" },
        { status: 400 }
      );
    }
    if (!VALID_GOALS.includes(goal)) {
      return NextResponse.json(
        {
          error: `Invalid health goal. Choose from: ${VALID_GOALS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const prompt = createMealPlanPrompt(
      goal,
      dietaryPreferences,
      allergies,
      cuisinePreferences,
      days
    );
    const response = await callGeminiAPI(prompt);
    const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) {
      throw new Error("Empty response from AI");
    }

    const mealPlan = parseMealPlanResponse(aiText);

    return NextResponse.json({
      status: "success",
      goal,
      dietaryPreferences,
      days,
      mealPlan,
      disclaimer: "Consult a nutritionist for personalized advice",
    });
  } catch (error) {
    console.error("Meal Planner Error:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan", details: error.message },
      { status: 500 }
    );
  }
}

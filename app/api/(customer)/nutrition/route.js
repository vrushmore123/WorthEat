import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { proteinGoal, dietaryPreference } = await req.json();

    // Validate input
    if (!proteinGoal) {
      return NextResponse.json(
        { error: "Please specify your protein goal (in grams)" },
        { status: 400 }
      );
    }

    // Fun protein facts to add surprise element
    const proteinFacts = [
      "Did you know? Chicken breast has about 31g protein per 100g!",
      "Fun fact: Lentils pack 18g protein per cup while being vegetarian!",
      "Surprise! Greek yogurt can have up to 17g protein per serving!",
      "Power tip: A can of tuna provides about 40g protein for quick gains!",
      "Who knew? Edamame beans offer 18g protein per cup as a snack!",
    ];

    const randomFact =
      proteinFacts[Math.floor(Math.random() * proteinFacts.length)];

    // Prepare prompt
    const prompt = `
      Nutrition Assistant - High Protein Meal Suggestions:
      
      User Requirements:
      - Protein target: ${proteinGoal}g per meal
      - Dietary preference: ${dietaryPreference || "No specific preference"}
      
      Task:
      1. Suggest 3 meal options that meet the protein target
      2. For each meal:
         - Name
         - Total protein content
         - 2 key ingredients
         - Preparation time (<30min)
      3. Include one unusual but nutritious high-protein suggestion as a "Surprise Protein Boost"
      
      Format response with clear headings.
    `;

    // Call Gemini API
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

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
          temperature: 0.9, // More creative
          topP: 0.95,
          maxOutputTokens: 800,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    // Parse response
    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No suggestions available.";

    return NextResponse.json(
      {
        proteinFact: randomFact,
        suggestions: aiResponse,
        debug: process.env.NODE_ENV === "development" ? { prompt } : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating nutrition suggestions:", error);
    return NextResponse.json(
      {
        error: "Failed to generate suggestions",
        proteinFact: "Even broccoli has protein! (2.5g per 100g)",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

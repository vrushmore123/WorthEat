import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Orders from "@/models/orders";
import axios from "axios";

export async function POST(req) {
  try {
    const { customerId, currentMood, city } = await req.json();

    // Validate input
    if (!customerId) {
      return NextResponse.json(
        { error: "Missing customerId" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Fetch orders
    const orders = await Orders.find({ customer: customerId })
      .populate("items.itemId")
      .sort({ createdAt: -1 });

    // Get current time (server time if not provided)
    const now = new Date();
    const currentHour = now.getHours();

    // Determine time category
    let currentTimeCategory;
    if (currentHour >= 5 && currentHour < 11) currentTimeCategory = "morning";
    else if (currentHour >= 11 && currentHour < 16)
      currentTimeCategory = "afternoon";
    else if (currentHour >= 16 && currentHour < 21)
      currentTimeCategory = "evening";
    else currentTimeCategory = "night";

    // Get weather data if city is provided
    let weatherData = {};
    if (city) {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );
        weatherData = {
          temp: weatherResponse.data.main.temp,
          condition: weatherResponse.data.weather[0].main,
          description: weatherResponse.data.weather[0].description,
        };
      } catch (weatherError) {
        console.error("Failed to fetch weather:", weatherError);
      }
    }

    // Analyze order patterns by time of day
    const timeBasedPreferences = {
      morning: { items: [], count: 0 },
      afternoon: { items: [], count: 0 },
      evening: { items: [], count: 0 },
      night: { items: [], count: 0 },
    };

    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        const orderTime = new Date(order.createdAt).getHours();
        let timeCategory;

        if (orderTime >= 5 && orderTime < 11) timeCategory = "morning";
        else if (orderTime >= 11 && orderTime < 16) timeCategory = "afternoon";
        else if (orderTime >= 16 && orderTime < 21) timeCategory = "evening";
        else timeCategory = "night";

        order.items.forEach((item) => {
          const itemName = item.itemId?.itemName || "Unknown Item";
          if (!timeBasedPreferences[timeCategory].items.includes(itemName)) {
            timeBasedPreferences[timeCategory].items.push(itemName);
          }
          timeBasedPreferences[timeCategory].count += item.quantity;
        });
      });
    }

    // Prepare prompt for AI
    const prompt = `
      Customer Meal Recommendation Assistant:
      
      Customer Context:
      - Customer ID: ${customerId}
      - Current Mood: ${currentMood || "Not specified"}
      - Current Time: ${currentTimeCategory} (${currentHour}:00)
      ${city ? `- Location: ${city}` : ""}
      ${
        weatherData.temp
          ? `- Current Weather: ${weatherData.temp}°C, ${weatherData.description}`
          : ""
      }

      Order History Analysis:
      Morning Orders (5AM-11AM): ${
        timeBasedPreferences.morning.items.join(", ") || "None"
      }
      Afternoon Orders (11AM-4PM): ${
        timeBasedPreferences.afternoon.items.join(", ") || "None"
      }
      Evening Orders (4PM-9PM): ${
        timeBasedPreferences.evening.items.join(", ") || "None"
      }
      Night Orders (9PM-5AM): ${
        timeBasedPreferences.night.items.join(", ") || "None"
      }

      Task:
      1. Generate 3 personalized food recommendations considering:
         - The current time of day (${currentTimeCategory})
         - The customer's mood (${currentMood || "unknown"})
         ${
           weatherData.temp
             ? `- Current weather conditions (${weatherData.temp}°C, ${weatherData.description})`
             : ""
         }
         - Their historical ordering patterns

      2. For each recommendation, include:
         - Meal name
         - Why it's suitable (considering mood, time, and weather if available)
         - How it relates to their past orders (if any)

      3. Also suggest 1 comfort food based on their mood.

      Format the response with clear headings for "Time-Based Recommendations" and "Mood Comfort Food".
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
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1000,
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
      "No recommendations available.";

    // Extract recommendations
    const timeBasedRecs = aiResponse.includes("Time-Based Recommendations")
      ? aiResponse
          .split("Time-Based Recommendations")[1]
          .split("Mood Comfort Food")[0]
      : aiResponse;

    const recommendations = timeBasedRecs
      .split("\n")
      .filter((line) => line.trim().match(/^[1-3]\.|- |\* /))
      .map((line) => line.replace(/^[1-3]\.\s*|- |\* /, "").trim())
      .filter(Boolean)
      .slice(0, 3);

    // Extract comfort food
    const comfortFoodSection = aiResponse.includes("Mood Comfort Food")
      ? aiResponse.split("Mood Comfort Food")[1]
      : "";

    const comfortFood = comfortFoodSection
      .split("\n")
      .find((line) => line.trim().match(/^- |\* |• /))
      ?.replace(/^- |\* |• /, "")
      ?.trim();

    return NextResponse.json(
      {
        timeBasedRecommendations: recommendations,
        moodComfortFood: comfortFood || "Not suggested",
        timeContext: currentTimeCategory,
        weather: city ? weatherData : undefined,
        debug:
          process.env.NODE_ENV === "development"
            ? {
                prompt,
                fullResponse: aiResponse,
              }
            : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
        details:
          process.env.NODE_ENV === "development"
            ? {
                message: error.message,
                stack: error.stack,
              }
            : undefined,
      },
      { status: 500 }
    );
  }
}

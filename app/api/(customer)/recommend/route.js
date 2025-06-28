import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Orders from "@/models/orders";
import axios from "axios";

export async function POST(req) {
  try {
    const { customerId, dietary_restrictions, region } = await req.json();

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

    // Prepare order history analysis
    const itemFrequency = {};
    const pastOrders = [];

    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        order.items.forEach((item) => {
          const itemName = item.itemId?.itemName || "Unknown Item";
          if (!itemFrequency[itemName]) {
            itemFrequency[itemName] = { count: 0, category: item.category };
          }
          itemFrequency[itemName].count += item.quantity;
          if (!pastOrders.includes(itemName)) {
            pastOrders.push(itemName);
          }
        });
      });
    }

    const sortedItems = Object.entries(itemFrequency)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([itemName, details]) => ({
        item: itemName,
        category: details.category,
        frequency: details.count,
      }));

    // Prepare prompt
    const prompt = `
      Customer Profile:
      - Customer ID: ${customerId}
      - Dietary Restrictions: ${dietary_restrictions}
      - Region: ${region}
      - Past Orders: ${pastOrders.length ? pastOrders.join(", ") : "None"}

      Order History Analysis:
      ${sortedItems
        .map(
          (item) =>
            `Item: ${item.item}, Category: ${item.category}, Frequency: ${item.frequency}`
        )
        .join("\n")}

      Generate 3 personalized food recommendations that align with the customer's dietary preferences, region, and past ordering habits.
      Format the recommendations as a bulleted list with a brief explanation for each recommendation.
      Each recommendation should include:
      - The food item name
      - Why it's recommended (considering their dietary restrictions and region)
      - How it relates to their past orders (if any)
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
        timeout: 10000, // 10 second timeout
      }
    );

    // Parse response
    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No recommendations available.";

    // Format recommendations
    const recommendations = aiResponse
      .split("\n")
      .filter(
        (line) =>
          line.trim().startsWith("-") ||
          line.trim().startsWith("*") ||
          line.trim().startsWith("•")
      )
      .map((rec) => ({
        item: rec.replace(/^[-*•]\s*/, "").trim(),
        category: "AI-Generated",
        reason: "Personalized recommendation based on your profile",
      }));

    return NextResponse.json(
      {
        recommendations: recommendations.slice(0, 3),
        debug: process.env.NODE_ENV === "development" ? aiResponse : undefined,
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
                response: error.response?.data,
                stack: error.stack,
              }
            : undefined,
      },
      { status: 500 }
    );
  }
}

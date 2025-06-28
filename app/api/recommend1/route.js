import { recommendDishes } from "../../../lib/recommendDishes";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "mumbai";
    console.log("📍 Requested city:", city);

    const recommendations = await recommendDishes(city);
    console.log("✅ Final Recommendations:", recommendations);

    return new Response(JSON.stringify(recommendations), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

import { connectMongoDB } from "@/lib/mongodb";
import Cart from "@/models/cart";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { customerId, foodId, quantity, date } = await req.json();

    if (!customerId || !foodId || !quantity || !date) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const cartItem = {
      customerId,
      foodId,
      quantity,
      date,
      createdAt: new Date(),
    };

    await Cart.create(cartItem);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Item added to cart successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

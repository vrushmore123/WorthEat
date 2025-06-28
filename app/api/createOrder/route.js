import { NextResponse } from "next/server";
import { connectMongoDB } from "@/utils/db";
import Order from "@/models/orders";

export async function POST(req) {
  try {
    await connectMongoDB();

    const body = await req.json();
    if (!body.customerId || !body.items) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newOrder = new Order({
      customerId: body.customerId,
      items: body.items,
      totalPrice: body.totalPrice,
      createdAt: new Date(),
    });

    await newOrder.save();

    return NextResponse.json(
      { success: true, order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

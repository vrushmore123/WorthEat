import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email }).select("_id email password");

    if (!password) {
      // This is for the registration check
      return NextResponse.json({ user });
    }

    // This is for the login
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 400 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 400 });
    }

    return NextResponse.json({ user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}

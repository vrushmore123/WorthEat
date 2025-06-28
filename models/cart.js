import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  quantity: { type: Number, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);

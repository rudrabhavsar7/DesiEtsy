import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "artisan"],
    default: "user",
  },
  cart: {
    type: [
      {
        productId: {
          type: String,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        size: {
          type: String,
        },
      },
    ],
    default: [],
  },
});

export default mongoose.models.User || mongoose.model("User", User);

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    orderItems: [
      {
        product: { type: String, required: true, ref: "product" },
        quantity: { type: Number, required: true },
        size: { type: String },
        price: { type: Number },
        image: {
          type: String,
        },
        artisanId: {
          type:String,
          ref : "artisans"
        }
      },
    ],
    amount: { type: Number, required: true },
    shippingAddress: { type: Object, required: true, ref: "address" },
    status: { type: String, default: "Processing" },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

export default Order;
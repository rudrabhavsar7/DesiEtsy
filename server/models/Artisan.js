import mongoose from "mongoose";

const ArtisanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    Id: {
      type: String,
      required: true,
      minlength: 12,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    products: {
      type: [
        {
          type: String,
          ref: "Product",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Artisan = mongoose.model("Artisan", ArtisanSchema);

export default Artisan;

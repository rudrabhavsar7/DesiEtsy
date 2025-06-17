import mongoose from "mongoose"

const Admin = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

export default mongoose.models.Admin || mongoose.model("Admin", Admin);
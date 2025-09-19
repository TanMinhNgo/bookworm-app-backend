import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Token = mongoose.model("Token", tokenSchema);

export default Token;

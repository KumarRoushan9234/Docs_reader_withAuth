const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🔹 Store documents as a key-value object instead of an array
    Docs: { type: Map, of: String, default: {} },
    summary:{},
    key_points:{},
    model_id: { type: String, default: "llama-3.1-8b-instant" },

    chatHistory: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    loginHistory: [
      {
        date: { type: Date, default: Date.now },
        count: { type: Number, default: 1 },
      },
    ],

    totalUsage: {
      chats: { type: Number, default: 0 },
      uploads: { type: Number, default: 0 },
      quizzesGenerated: { type: Number, default: 0 },
    },

    settings: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      language: { type: String, default: "en" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

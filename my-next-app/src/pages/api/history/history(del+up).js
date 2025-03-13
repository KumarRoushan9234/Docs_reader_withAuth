import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
      const user = await User.findById(userId).select("chatHistory");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, chatHistory: user.chatHistory });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error });
    }
  }

  if (req.method == "POST") {
    
    const { user_id, chat_entry } = req.body;

    if (!user_id || !chat_entry) {
    return res.status(400).json({ success: false, message: "User ID and chat entry are required" });
    }

    try {
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      user.chatHistory.push(chat_entry);
      await user.save();

      return res.status(200).json({ success: true, message: "Chat history updated" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error });
    }
  }
  
  if (req.method === "DELETE") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
      await User.findByIdAndUpdate(userId, { chatHistory: [] });
      return res.status(200).json({ success: true, message: "Chat history deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}

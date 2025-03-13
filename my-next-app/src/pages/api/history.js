import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await connectDB();

    // Get the authenticated user session
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find the user in the database using the session user ID
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, chatHistory: user.chatHistory || [] });

  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

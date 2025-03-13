import { getServerSession } from "next-auth";
import { serialize } from "cookie";
import nextAuthOptions from "./[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const session = await getServerSession(req, res, nextAuthOptions);

    if (!session) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Clear authentication cookies
    res.setHeader(
      "Set-Cookie",
      [
        serialize("next-auth.session-token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          expires: new Date(0),
        }),
        serialize("next-auth.callback-url", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          expires: new Date(0),
        }),
      ]
    );

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

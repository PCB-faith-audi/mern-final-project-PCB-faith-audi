import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = new Clerk({ apiKey: process.env.CLERK_API_KEY });

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // Basic verification (adjust per Clerk docs if needed)
    const session = await clerk.sessions.verifySessionToken(token);
    req.user = { id: session.userId };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

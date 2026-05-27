import { db } from "../config/firebaseConfig.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.userId;

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    const userData = userDoc.data();

    if (userData.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Admins only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Admin check failed",
      error: error.message,
    });
  }
};

export default adminMiddleware;
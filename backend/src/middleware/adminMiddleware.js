import { userRepository } from "../repositories/userRepository.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await userRepository.getById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    if (user.role !== "admin") {
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

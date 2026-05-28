import { AppError } from "../errors/AppError.js";
import { authService } from "../services/authService.js";

export const registerUser = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      uid: result.uid,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to register user",
      error: error.details || error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      uid: result.uid,
      user: result.user,
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      message: error.message || "Login failed",
      error: error.details || error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const session = await authService.getCurrentUser(req.userId);
    res.status(200).json(session);
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      message: error.message || "Failed to load session",
      error: error.details || error.message,
    });
  }
};

export const logoutUser = async (_req, res) => {
  res.clearCookie("token", authService.logoutConfig());

  res.status(200).json({
    message: "Logout successful",
  });
};
 

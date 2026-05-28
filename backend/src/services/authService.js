import axios from "axios";
import { AppError } from "../errors/AppError.js";
import { userRepository } from "../repositories/userRepository.js";
import { serializeTimestamp } from "../utils/serialization.js";

const defaultSchedule = {
  start: "09:00",
  end: "18:00",
};

const serializeUser = (user) => ({
  uid: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  timezone: user.timezone,
  schedule: user.schedule,
  createdAt: serializeTimestamp(user.createdAt),
});

export const authService = {
  async registerUser(payload) {
    const {
      name,
      email,
      password,
      timezone = "Asia/Manila",
      schedule = defaultSchedule,
    } = payload;

    const userRecord = await userRepository.createAuthUser({
      email,
      password,
      displayName: name,
    });

    await userRepository.createProfile(userRecord.uid, {
      name,
      email,
      role: "employee",
      timezone,
      schedule,
      createdAt: new Date(),
    });

    return {
      uid: userRecord.uid,
    };
  },

  async loginUser({ email, password }) {
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );

      const { localId, idToken } = response.data;
      const profile = await userRepository.getById(localId);

      if (!profile) {
        throw new AppError("User profile not found", 404);
      }

      return {
        uid: localId,
        token: idToken,
        user: serializeUser(profile),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Login failed",
        500,
        error.response?.data?.error?.message || error.message
      );
    }
  },

  async getCurrentUser(userId) {
    const profile = await userRepository.getById(userId);

    if (!profile) {
      throw new AppError("User profile not found", 404);
    }

    return {
      uid: userId,
      user: serializeUser(profile),
    };
  },

  logoutConfig() {
    return {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    };
  },
};

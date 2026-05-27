import { auth, db } from "../config/firebaseConfig.js";
import axios from "axios";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "employee",
      timezone = "Asia/Manila",
      schedule = {
        start: "09:00",
        end: "18:00",
      },
    } = req.body;

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      role,
      timezone,
      schedule,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const data = response.data;

    const userDoc = await db.collection("users").doc(data.localId).get();

    res.cookie("token", data.idToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: "Login successful",
      uid: data.localId,
      user: userDoc.data(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.response?.data?.error?.message || error.message,
    });
  }
};
 
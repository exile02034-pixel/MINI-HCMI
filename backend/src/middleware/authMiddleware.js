import admin from "firebase-admin";

const authMiddleware = async (req, res, next) => {
  try {
   
    const token =req.cookies?.token 
  

   
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;
    req.userId = decodedToken.uid;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export default authMiddleware;
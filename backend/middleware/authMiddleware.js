const admin = require("../config/firebase");

const authenticateFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1].trim();
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticateFirebaseToken;

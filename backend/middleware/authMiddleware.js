const admin = require("../config/firebase");

const authenticateFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1].trim();
  console.log(token," passed from frontend to backend")
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log("Token decoded successfully: ", decodedToken);
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticateFirebaseToken;

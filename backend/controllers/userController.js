const prisma = require("../config/database.js");

const createUser = async (req, res) => {
  try {
    const { firebaseUid, name, email } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUid },
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        firebaseUid,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

module.exports = {
  createUser,
};

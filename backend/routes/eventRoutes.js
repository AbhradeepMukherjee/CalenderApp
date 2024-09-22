const express = require("express");
const router = express.Router();
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
} = require("../controllers/eventController.js");
const authenticateFirebaseToken = require("../middleware/authMiddleware.js");

router.use(authenticateFirebaseToken);

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;

//GET /api/v1/events
//GET /api/v1/events/:id
//POST /api/v1/events
//PUT /api/v1/events/:id
//DELETE /api/v1/events/:id

const prisma = require("../config/database.js");

const getAllEvents = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const events = await prisma.event.findMany({
      where: { userId: user.id },  
    });
    console.log(events);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const event = await prisma.event.findUnique({
      where: { id: req.params.id, userId: user.id },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, startDate, endDate, startTime, endTime, description, isAllDay, recurrence } = req.body;
    const user = await prisma.user.findUnique({ where: { firebaseUid: req.user.uid } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
        isAllDay,
        recurrence,
        userId: user.id,
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { title, startDate, endDate, startTime, endTime, description, isAllDay, recurrence } = req.body;
    const user = await prisma.user.findUnique({ where: { firebaseUid: req.user.uid } });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedEvent = await prisma.event.updateMany({
      where: { 
        id: req.params.id,
        userId: user.id
      },
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
        isAllDay,
        recurrence,
      },
    });

    if (updatedEvent.count === 0) {
      return res.status(404).json({ message: "Event not found or you don't have permission to update it" });
    }

    res.json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid: req.user.uid } });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedEvent = await prisma.event.deleteMany({
      where: { 
        id: req.params.id,
        userId: user.id
      },
    });

    if (deletedEvent.count === 0) {
      return res.status(404).json({ message: "Event not found or you don't have permission to delete it" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};

module.exports = {
  createEvent,
  deleteEvent,
  updateEvent,
  getAllEvents,
  getEventById,
};

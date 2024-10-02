//GET /api/v1/events
//GET /api/v1/events/:id
//POST /api/v1/events
//PUT /api/v1/events/:id
//DELETE /api/v1/events/:id
//GET /api/v1/events/week/:startOfWeek
//GET /api/v1/events/month/:monthNumber
//GET /api/v1/events/date/:date


const prisma = require("../config/database.js");

const getAllEvents = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
      orderBy: { startDate: 'asc' }
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
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
      orderBy: { startDate: 'asc' }
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

const getEventByMonth = async (req, res) => {
  try {
    const { monthNumber } = req.params;
    const month = parseInt(monthNumber, 10) - 1;
    if (isNaN(month) || month < 0 || month > 11) {
      return res.status(400).json({ message: "Invalid month number" });
    }
    const startOfMonth = new Date(new Date().getFullYear(), month, 1);
    const endOfMonth = new Date(
      new Date().getFullYear(),
      month + 1,
      0,
      23,
      59,
      59
    );
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const event = await prisma.event.findMany({
      where: {
        OR: [
          {
            startDate: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          {
            endDate: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          {
            startDate: {
              lt: startOfMonth,
            },
            endDate: {
              gt: endOfMonth,
            },
          },
        ],
        userId: user.id,
      },
      orderBy: { startDate: 'asc' },
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

const getEventsByWeek = async (req, res) => {
  try {
    const { startOfWeek } = req.params;
    if (!startOfWeek) {
      return res
        .status(400)
        .json({ message: "Please provide both startOfWeek and endOfWeek" });
    }
    const startDateOfWeek = new Date(startOfWeek);
    if (isNaN(startDateOfWeek.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const endDateOfWeek = new Date(startDateOfWeek);
    endDateOfWeek.setDate(startDateOfWeek.getDate() + 6);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            startDate: {
              gte: startDateOfWeek,
              lte: endDateOfWeek,
            },
          },
          {
            endDate: {
              gte: startDateOfWeek,
              lte: endDateOfWeek,
            },
          },
          {
            startDate: {
              lte: startDateOfWeek,
            },
            endDate: {
              gte: endDateOfWeek,
            },
          },
        ],
        userId: user.id,
      },
      orderBy: { startDate: 'asc' },
    });
    console.log("Events by week", events);
    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found for this week" });
    }
    res.json(events);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
};

const getEventsByDate = async(req, res)=>{
  try{
    const {date} = req.params;
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            startDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          {
            endDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          {
            startDate: {
              lt: startOfDay,
            },
            endDate: {
              gt: endOfDay,
            },
          },
        ],
        userId: user.id,
      },
      orderBy: { startDate: 'asc' },
    });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found for this date" });
    }
    res.json(events);
  }catch(error){
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
}

const createEvent = async (req, res) => {
  console.log("req", req.body, req.user);
  try {
    const {
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      description,
      isAllDay,
      recurrence,
    } = req.body;
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });
    console.log(user, req.user.uid);
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
    res
      .status(500)
      .json({ message: "Error creating event", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const {
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      description,
      isAllDay,
      recurrence,
    } = req.body;
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedEvent = await prisma.event.updateMany({
      where: {
        id: req.params.id,
        userId: user.id,
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
      return res.status(404).json({
        message: "Event not found or you don't have permission to update it",
      });
    }

    res.json({ message: "Event updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating event", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedEvent = await prisma.event.deleteMany({
      where: {
        id: req.params.id,
        userId: user.id,
      },
    });

    if (deletedEvent.count === 0) {
      return res.status(404).json({
        message: "Event not found or you don't have permission to delete it",
      });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};

module.exports = {
  createEvent,
  deleteEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  getEventByMonth,
  getEventsByWeek,
  getEventsByDate
};

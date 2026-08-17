const Event = require("../models/Event");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    location,
    capacity,
    category,
  } = req.body;

  const event = await Event.create({
    title,
    description,
    date,
    location,
    capacity,
    category,
    organizer: req.user._id,
  });

  res.status(201).json({
    message: "Event created successfully",
    event,
  });
});

const getAllEvents = asyncHandler(async (req, res) => {
  const {
    category,
    location,
    date,
    search,
    sort,
    page,
    limit,
  } = req.query;

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (location) {
    filter.location = {
      $regex: location,
      $options: "i",
    };
  }

  if (date) {
    filter.date = {
      $gte: new Date(date),
      $lt: new Date(
        new Date(date).setDate(new Date(date).getDate() + 1)
      ),
    };
  }

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  let sortOption = { createdAt: -1 };

  if (sort === "date") {
    sortOption = { date: 1 };
  } else if (sort === "-date") {
    sortOption = { date: -1 };
  } else if (sort === "capacity") {
    sortOption = { capacity: 1 };
  } else if (sort === "-capacity") {
    sortOption = { capacity: -1 };
  } else if (sort === "title") {
    sortOption = { title: 1 };
  } else if (sort === "-title") {
    sortOption = { title: -1 };
  }

  const currentPage = Number(page) || 1;
  const pageLimit = Number(limit) || 10;

  const skip = (currentPage - 1) * pageLimit;

  const totalEvents = await Event.countDocuments(filter);

  const events = await Event.find(filter)
    .sort(sortOption)
    .populate("category", "name")
    .populate("organizer", "name")
    .skip(skip)
    .limit(pageLimit);

  res.status(200).json({
    page: currentPage,
    limit: pageLimit,
    totalEvents,
    totalPages: Math.ceil(totalEvents / pageLimit),
    count: events.length,
    events,
  });
});

const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({
    organizer: req.user._id,
  })
    .populate("category", "name")
    .populate("organizer", "name");

  res.status(200).json({
    count: events.length,
    events,
  });
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("category", "name")
    .populate("organizer", "name");

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  res.status(200).json(event);
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    throw new AppError("Access denied", 403);
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("category", "name")
    .populate("organizer", "name");

  res.status(200).json({
    message: "Event updated successfully",
    event: updatedEvent,
  });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    throw new AppError("Access denied", 403);
  }

  await Event.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Event deleted successfully",
  });
});

module.exports = {
  createEvent,
  getAllEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const existingRegistration = await Registration.findOne({
    user: req.user._id,
    event: eventId,
  });

  if (existingRegistration) {
    throw new AppError(
      "You are already registered for this event",
      400
    );
  }

  const registrationCount = await Registration.countDocuments({
    event: eventId,
  });

  if (registrationCount >= event.capacity) {
    throw new AppError("Event is full", 400);
  }

  const registration = await Registration.create({
    user: req.user._id,
    event: eventId,
  });

  res.status(201).json({
    message: "Registered for event successfully",
    registration,
  });
});

const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({
    user: req.user._id,
  }).populate("event");

  res.status(200).json({
    count: registrations.length,
    registrations,
  });
});

const cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    throw new AppError("Registration not found", 404);
  }

  if (registration.user.toString() !== req.user._id.toString()) {
    throw new AppError("Access denied", 403);
  }

  await Registration.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Registration cancelled successfully",
  });
});

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
};
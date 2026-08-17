const mongoose = require("mongoose");
const Message = require("../models/Message");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getEventMessages = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID", 400);
  }

  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  if (req.user.role === "attendee") {
    const registration = await Registration.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (!registration) {
      throw new AppError(
        "You are not registered for this event",
        403
      );
    }
  }

  if (req.user.role === "admin") {
    if (
      event.organizer.toString() !==
      req.user._id.toString()
    ) {
      throw new AppError("Access denied", 403);
    }
  }

  const messages = await Message.find({
    event: eventId,
  })
    .populate("sender", "name email")
    .populate("event", "title")
    .sort({ createdAt: 1 });

  res.status(200).json({
    count: messages.length,
    messages,
  });
});

module.exports = {
  getEventMessages,
};
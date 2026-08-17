const express = require("express");
const { body, param } = require("express-validator");

const {
  createEvent,
  getAllEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.get("/", getAllEvents);

router.get(
  "/my-events",
  requireAuth,
  requireRole("admin"),
  getMyEvents
);

router.get("/:id", getEventById);

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),

    body("date")
      .isISO8601()
      .withMessage("Date must be a valid date"),

    body("location")
      .trim()
      .notEmpty()
      .withMessage("Location is required"),

    body("capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),

    body("category")
      .isMongoId()
      .withMessage("Category must be a valid ID"),
  ],
  validateRequest,
  createEvent
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  [
    param("id")
      .isMongoId()
      .withMessage("Event ID must be valid"),

    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description cannot be empty"),

    body("date")
      .optional()
      .isISO8601()
      .withMessage("Date must be a valid date"),

    body("location")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Location cannot be empty"),

    body("capacity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),

    body("category")
      .optional()
      .isMongoId()
      .withMessage("Category must be a valid ID"),
  ],
  validateRequest,
  updateEvent
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  deleteEvent
);

module.exports = router;
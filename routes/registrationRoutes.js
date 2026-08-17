const express = require("express");
const { body } = require("express-validator");

const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");

const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("attendee"),
  [
    body("eventId")
      .isMongoId()
      .withMessage("Event ID must be valid"),
  ],
  validateRequest,
  registerForEvent
);

router.get(
  "/",
  requireAuth,
  requireRole("attendee"),
  getMyRegistrations
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("attendee"),
  cancelRegistration
);

module.exports = router;
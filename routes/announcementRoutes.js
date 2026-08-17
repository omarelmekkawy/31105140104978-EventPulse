const express = require("express");

const {
  getEventMessages,
} = require("../controllers/announcementController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get(
  "/event/:eventId",
  requireAuth,
  getEventMessages
);

module.exports = router;
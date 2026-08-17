require("dotenv").config();

const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");

const User = require("./models/User");
const Registration = require("./models/Registration");
const Event = require("./models/Event");
const Message = require("./models/Message");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;

    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", async (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  console.log(`User connected: ${socket.user.name}`);

  try {
    if (socket.user.role === "attendee") {
      const registrations = await Registration.find({
        user: socket.user._id,
      }).select("event");

      for (const registration of registrations) {
        const eventId = registration.event.toString();

        socket.join(`event:${eventId}`);

        const event = await Event.findById(eventId).select(
          "title"
        );

        const messages = await Message.find({
          event: eventId,
        })
          .populate("sender", "name email")
          .sort({ createdAt: 1 });

        socket.emit("messageHistory", {
          event: event,
          messages,
        });
      }

      console.log(
        `Attendee joined ${registrations.length} event room(s)`
      );
    }

    socket.on(
      "broadcastAnnouncement",
      async ({ eventId, message }) => {
        try {
          if (socket.user.role !== "admin") {
            socket.emit("announcementError", {
              message: "Only admins can broadcast announcements",
            });
            return;
          }

          if (!eventId || !message || !message.trim()) {
            socket.emit("announcementError", {
              message: "Event ID and message are required",
            });
            return;
          }

          const event = await Event.findById(eventId);

          if (!event) {
            socket.emit("announcementError", {
              message: "Event not found",
            });
            return;
          }

          if (
            event.organizer.toString() !==
            socket.user._id.toString()
          ) {
            socket.emit("announcementError", {
              message: "You can only announce for your own events",
            });
            return;
          }

          const announcement = await Message.create({
            event: eventId,
            sender: socket.user._id,
            message: message.trim(),
          });

          const populatedAnnouncement = await Message.findById(
            announcement._id
          )
            .populate("event", "title")
            .populate("sender", "name email");

          io.to(`event:${eventId}`).emit("announcement", {
            _id: populatedAnnouncement._id,
            event: populatedAnnouncement.event,
            sender: populatedAnnouncement.sender,
            message: populatedAnnouncement.message,
            createdAt: populatedAnnouncement.createdAt,
          });

          socket.emit("announcementSent", {
            message: "Announcement sent successfully",
            announcement: {
              _id: populatedAnnouncement._id,
              event: populatedAnnouncement.event,
              sender: populatedAnnouncement.sender,
              message: populatedAnnouncement.message,
              createdAt: populatedAnnouncement.createdAt,
            },
          });
        } catch (error) {
          socket.emit("announcementError", {
            message: error.message,
          });
        }
      }
    );
  } catch (error) {
    console.error(error.message);
  }

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
};

startServer();
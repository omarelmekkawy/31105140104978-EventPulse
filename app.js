const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const messageRoutes = require("./routes/announcementRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    server: "up",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// CDN Assets to fix the Vercel blank white screen issue
const CSS_URL = "https://cloudflare.com";
const JS_URL = [
  "https://cloudflare.com",
  "https://cloudflare.com"
];

// Serve Swagger docs with custom CDN asset links
app.use(
  "/api-docs", 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: CSS_URL,
    customJs: JS_URL
  })
);

app.use(errorHandler);

module.exports = app;

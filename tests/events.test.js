require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = require("../app");
const User = require("../models/User");
const Category = require("../models/Category");
const Event = require("../models/Event");
const generateToken = require("../utils/generateToken");

describe("Events API - Task 6", () => {
  let admin;
  let category;
  let token;

  const testEmail = `task6-admin-${Date.now()}@example.com`;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("123456", 10);

    admin = await User.create({
      name: "Task 6 Admin",
      email: testEmail,
      password: hashedPassword,
      role: "admin",
    });

    category = await mongoose.model("Category").create({
      name: `Task 6 Category ${Date.now()}`,
      description: "Category for Task 6 tests",
    });

    token = generateToken(admin);

    await Event.create([
      {
        title: "Task 6 Cairo Event",
        description: "Cairo test event",
        date: new Date("2027-01-10"),
        location: "Cairo",
        capacity: 100,
        category: category._id,
        organizer: admin._id,
      },
      {
        title: "Task 6 Alexandria Event",
        description: "Alexandria test event",
        date: new Date("2027-01-11"),
        location: "Alexandria",
        capacity: 50,
        category: category._id,
        organizer: admin._id,
      },
    ]);
  });

  afterAll(async () => {
    await Event.deleteMany({
      organizer: admin._id,
    });

    await User.findByIdAndDelete(admin._id);
    await mongoose.model("Category").findByIdAndDelete(category._id);

    await mongoose.connection.close();
  });

  test("POST /api/events creates an event", async () => {
    const response = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Task 6 Created Event",
        description: "Event created using Supertest",
        date: "2027-02-15T10:00:00.000Z",
        location: "Giza",
        capacity: 75,
        category: category._id.toString(),
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Event created successfully");
    expect(response.body.event).toBeDefined();
    expect(response.body.event.title).toBe("Task 6 Created Event");
  });

  test("GET /api/events lists events", async () => {
    const response = await request(app)
      .get("/api/events");

    expect(response.statusCode).toBe(200);
    expect(response.body.events).toBeInstanceOf(Array);
    expect(response.body.count).toBeGreaterThan(0);
  });

  test("GET /api/events filters events by location", async () => {
    const response = await request(app)
      .get("/api/events")
      .query({
        location: "Cairo",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.events).toBeInstanceOf(Array);
    expect(response.body.events.length).toBeGreaterThan(0);

    for (const event of response.body.events) {
      expect(event.location.toLowerCase()).toContain("cairo");
    }
  });
});
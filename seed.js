require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = require("./config/db");

const User = require("./models/User");
const Category = require("./models/Category");
const Event = require("./models/Event");

const categories = require("./data/categories");
const users = require("./data/users");
const events = require("./data/events");

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Category.deleteMany();
    await Event.deleteMany();

    const createdCategories = await Category.insertMany(categories);

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const createdUsers = await User.insertMany(hashedUsers);

    const admin = createdUsers.find((user) => user.role === "admin");

    const eventsToInsert = [
      {
        ...events[0],
        category: createdCategories[0]._id,
        organizer: admin._id,
      },
      {
        ...events[1],
        category: createdCategories[1]._id,
        organizer: admin._id,
      },
      {
        ...events[2],
        category: createdCategories[2]._id,
        organizer: admin._id,
      },
    ];

    await Event.insertMany(eventsToInsert);

    console.log("Database seeded successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedData();
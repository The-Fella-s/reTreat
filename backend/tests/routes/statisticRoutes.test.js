// statisticsRoutes.test.js

// Set a fake encryption key for testing
process.env.ENCRYPTION_KEY = 'key-for-testing';

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const MockDate = require("mockdate"); // <-- Import mockdate
const Statistics = require("../../models/Statistics");
const statisticsRoutes = require("../../routes/statisticsRoutes");


describe("Statistics Routes (Unique Signups & Daily Signups)", () => {
  let mongoServer;
  let app;

  beforeAll(async () => {
    // Spin up in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create an Express app and mount your routes
    app = express();
    app.use(express.json());
    app.use("/", statisticsRoutes);

    // 1) Freeze the system date/time to Monday at 10:00:00 UTC
    MockDate.set("2025-09-15T10:00:00Z"); 
    // new Date().toLocaleString("en-US", { weekday: "long" }) => "Monday"
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();

    // 2) Reset date to real time
    MockDate.reset();
  });

  afterEach(async () => {
    // Clear the collection after each test
    await Statistics.deleteMany({});
  });

  test("POST /update-signups increments uniqueSignups and Monday’s dailySignups", async () => {
    // First signup
    let res = await request(app).post("/update-signups");
    expect(res.status).toBe(200);
    expect(res.body.uniqueSignups).toBe(1);
    expect(res.body.dailySignups.Monday).toBe(1); // because we froze date to Monday

    // Second signup
    res = await request(app).post("/update-signups");
    expect(res.status).toBe(200);
    expect(res.body.uniqueSignups).toBe(2);
    expect(res.body.dailySignups.Monday).toBe(2);
  });

  test("GET / returns existing stats doc", async () => {
    // Insert a doc
    await Statistics.create({
      uniqueSignups: 5,
      dailySignups: { Monday: 3 },
    });

    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.uniqueSignups).toBe(5);
    expect(res.body.dailySignups.Monday).toBe(3);
  });

  
});

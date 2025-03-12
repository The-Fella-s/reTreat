/**
 * @file websiteVisitRoutes.test.js
 */
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const websiteVisitRoutes = require("../../routes/websiteVisitRoutes"); // Adjust path
const WebsiteVisit = require("../../models/WebsiteVisit");

let mongoServer;
let app;

describe("Website Visit Routes", () => {
  beforeAll(async () => {
    // Spin up an in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect Mongoose to the in-memory DB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create an Express app and mount the routes
    app = express();
    app.use(express.json());
    app.use("/visits", websiteVisitRoutes);
  });

  afterAll(async () => {
    // Close the DB and server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clear data after each test
    await WebsiteVisit.deleteMany({});
  });

  test("GET /visits/get - returns default values if no doc in DB", async () => {
    const res = await request(app).get("/visits/get");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      totalVisits: 0,
      dailyVisits: {},
    });
  });

  test("POST /visits/track - creates a new doc if none exists", async () => {
    const res = await request(app).post("/visits/track");
    expect(res.status).toBe(200);

    // The response should have success: true and updated totals
    expect(res.body.success).toBe(true);
    expect(res.body.totalVisits).toBe(1);

    // Check if doc was actually created in DB
    const doc = await WebsiteVisit.findOne();
    expect(doc.totalVisits).toBe(1);

    // dailyVisits should have incremented for the current day
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[new Date().getDay()];
    expect(doc.dailyVisits[currentDay]).toBe(1);
  });

  test("POST /visits/track - increments existing doc", async () => {
    // Create an existing doc
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[new Date().getDay()];

    await WebsiteVisit.create({
      totalVisits: 5,
      dailyVisits: { [currentDay]: 2 },
    });

    // Track a new visit
    const res = await request(app).post("/visits/track");
    expect(res.status).toBe(200);
    expect(res.body.totalVisits).toBe(6); // totalVisits should increment by 1
    expect(res.body.dailyVisits[currentDay]).toBe(3); // dailyVisits for currentDay should increment by 1
  });

  test("GET /visits/get - returns existing doc data", async () => {
    await WebsiteVisit.create({
      totalVisits: 10,
      dailyVisits: { Monday: 4 },
    });

    const res = await request(app).get("/visits/get");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalVisits).toBe(10);
    expect(res.body.dailyVisits).toMatchObject({ Monday: 4 });
  });
});

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { SquareClient } = require("square");
const Payment = require("../../models/Payments"); // Mocked model
const paymentRoutes = require("../../routes/paymentsRoutes");

jest.mock("square", () => ({
    SquareClient: jest.fn().mockImplementation(() => ({
      payments: {
        get: jest.fn().mockResolvedValue({
          payment: {
            id: "test_payment_id",
            status: "COMPLETED",
            amountMoney: {
              amount: 5000, // 5000 cents = $50
              currency: "USD",
            },
          },
        }),
      },
    })),
    SquareEnvironment: { Sandbox: "sandbox" }, 
  }));
  

// Mock Payment Model
jest.mock("../../models/Payments", () => ({
  findOneAndUpdate: jest.fn(),
}));

describe("Payment Routes Tests", () => {
  let app;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use("/payments", paymentRoutes);

    // Connect to in-memory MongoDB
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("fetchPayment should store payment in MongoDB", async () => {
    // Mock Payment.findOneAndUpdate to simulate database behavior
    Payment.findOneAndUpdate.mockResolvedValue({
      paymentId: "test_payment_id",
      status: "COMPLETED",
      amount: 50, // Converted from cents
      currency: "USD",
    });

    // Call fetchPayment (indirectly via route)
    const response = await request(app).get("/payments/fetch");

    // Assertions
    expect(response.status).toBe(200);
    expect(Payment.findOneAndUpdate).toHaveBeenCalledWith(
      { paymentId: "test_payment_id" },
      {
        status: "COMPLETED",
        amount: 50,
        currency: "USD",
      },
      { upsert: true, new: true }
    );
  });
});

afterAll(async () => {
    await mongoose.connection.close(); // ✅ Ensure Mongoose disconnects
    await new Promise(resolve => setTimeout(resolve, 500)); // ✅ Allow time for cleanup
});

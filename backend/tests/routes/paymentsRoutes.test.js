// paymentsRoutes.test.js
const request = require("supertest");
const express = require("express");
const { SquareClient, SquareEnvironment } = require("square");
const paymentsRoutes = require("../../routes/paymentsRoutes"); // Adjust path as needed

jest.mock("square", () => {
  const mockPayments = { list: jest.fn() };
  return {
    SquareClient: jest.fn().mockImplementation(() => ({
      payments: mockPayments,
    })),
    SquareEnvironment: { Sandbox: "sandbox" },
  };
});

describe("Payments Routes - /list Endpoint", () => {
  let app;
  let mockPayments;

  // Silence console.error for the entire describe block
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore console.error to original after all tests
    console.error.mockRestore();
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/payments", paymentsRoutes);

    // Access the mock 'payments' object from the SquareClient
    const mockSquareClient = new SquareClient({
      token: "fake-token",
      environment: SquareEnvironment.Sandbox,
    });
    mockPayments = mockSquareClient.payments;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/payments/list returns list of payments (status 200)", async () => {
    const mockData = [{ id: "payment1" }, { id: "payment2" }];
    mockPayments.list.mockResolvedValue({ data: mockData });

    const response = await request(app).get("/api/payments/list");
    expect(response.status).toBe(200);

    const parsed = JSON.parse(response.text);
    expect(parsed.data).toEqual(mockData);
  });

  test("GET /api/payments/list handles error with status 500", async () => {
    // Here we define the EXACT error message
    mockPayments.list.mockRejectedValue(new Error("Square error message"));

    const response = await request(app).get("/api/payments/list");
    expect(response.status).toBe(500);

    // The route does: res.status(500).json({ error: error.message })
    expect(response.body.error).toBe("Square error message");
  });
});

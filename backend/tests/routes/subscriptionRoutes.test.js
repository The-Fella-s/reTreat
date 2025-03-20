// __tests__/subscriptionRoutes.test.js
const request = require('supertest');
const express = require('express');
const subscriptionRoutes = require('../../routes/subscriptionRoutes');
const { generateIdempotencyKey } = require('../../utilities/helpers/randomGenerator');

// Create an express app instance for testing.
const app = express();
app.use(express.json());
app.use('/api/subscriptions', subscriptionRoutes);

// --- MOCKING SQUARE CLIENT METHODS ---
// We want to avoid actual HTTP calls to Square in our tests.
// Since your subscriptionRoutes file uses "SquareClient" from 'square',
// we can use jest.mock to override the methods used.

// Create a dummy response that mimics Square's API responses.
const dummyCatalogResponse = {
  object: { id: 'dummy_id', version: '1' }
};

const dummyCheckoutResponse = {
  paymentLink: { url: 'https://square.link/dummy_payment_link' }
};

// Mock implementation for Square client's catalog and checkout methods.
jest.mock('square', () => {
  return {
    SquareClient: jest.fn().mockImplementation(() => ({
      catalog: {
        object: {
          upsert: jest.fn(() => Promise.resolve({ result: dummyCatalogResponse })),
          get: jest.fn(() => Promise.resolve({ result: dummyCatalogResponse })),
          list: jest.fn(() => Promise.resolve({ result: { objects: [dummyCatalogResponse] } })),
          delete: jest.fn(() => Promise.resolve({ result: {} }))
        }
      },
      checkoutApi: {
        createPaymentLink: jest.fn(() => Promise.resolve({ result: dummyCheckoutResponse }))
      }
    })),
    SquareEnvironment: {
      Sandbox: 'Sandbox'
    }
  };
});

describe('Subscription Routes', () => {

  // Test for creating a subscription plan
  describe('POST /api/subscriptions/plan', () => {
    it('should create a subscription plan and return a 201 status', async () => {
      const payload = {
        name: "Membership Tiers",
        description: "Monthly membership subscription"
      };

      const response = await request(app)
        .post('/api/subscriptions/plan')
        .send(payload)
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Subscription plan created successfully');
      // Expect that our dummy Square response is returned.
      expect(response.body.squareResponse.object.id).toBe('dummy_id');
    });
  });

  // Test for creating a subscription plan variation
  describe('POST /api/subscriptions/variation', () => {
    it('should create a subscription plan variation and return a 201 status', async () => {
      const payload = {
        planId: "dummy_plan_id",
        variationName: "Silver Membership Tier",
        amount: 1500,
        currency: "USD",
        cadence: "MONTHLY"
      };

      const response = await request(app)
        .post('/api/subscriptions/variation')
        .send(payload)
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Subscription plan variation created successfully');
      expect(response.body.squareResponse.object.id).toBe('dummy_id');
    });
  });

  // Test for creating a payment link
  describe('POST /api/subscriptions/payment-link', () => {
    it('should create a payment link and return a 200 status', async () => {
      const payload = {
        variationId: "dummy_variation_id",
        locationId: "dummy_location_id",
        amount: 1500,
        currency: "USD",
        name: "Silver Membership",
        description: "Billed monthly"
      };

      const response = await request(app)
        .post('/api/subscriptions/payment-link')
        .send(payload)
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Payment link created successfully');
      expect(response.body.squareResponse.paymentLink.url).toBe('https://square.link/dummy_payment_link');
    });
  });
});

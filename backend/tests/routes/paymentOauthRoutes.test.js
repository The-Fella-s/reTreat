const request = require('supertest');
const express = require('express');
const passport = require('passport');
const app = express();

// Mock all problematic dependencies
jest.mock('../../middleware/authMiddleware', () => ({
  protect: jest.fn((req, res, next) => next()),
}));

// Create a minimal express app for testing
const createTestApp = () => {
  const testApp = express();
  testApp.use(express.json());
  
  // Manually set up routes to match actual implementation
  const squareRoutes = require('../../routes/paymentOauthRoutes');
  testApp.use('/api/square', squareRoutes);
  
  return testApp;
};

// Mock passport and its methods
jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, options) => (req, res, next) => {
    // Simulate a redirect for auth routes
    if (strategy === 'square') {
      return (req, res) => {
        res.redirect('http://squareupsandbox.com/oauth2/authorize');
      };
    }
  }),
  initialize: jest.fn(),
  session: jest.fn()
}));

describe('Square OAuth Routes', () => {
  let testApp;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    testApp = createTestApp();
  });

  describe('GET /api/square/auth', () => {
    it('should initiate Square OAuth authentication', async () => {
      const response = await request(testApp)
        .get('/api/square/auth')
        .expect(302) // Expect a redirect
        .expect('Location', /squareupsandbox\.com/);

      // Verify passport authenticate was called
      expect(passport.authenticate).toHaveBeenCalledWith('square', expect.objectContaining({
        state: expect.any(String),
        scope: expect.arrayContaining([
          'MERCHANT_PROFILE_READ',
          'PAYMENTS_READ',
          'PAYMENTS_WRITE',
          'ORDERS_READ',
          'ORDERS_WRITE',
          'CUSTOMERS_READ',
          'CUSTOMERS_WRITE'
        ])
      }));
    });
  });

  describe('GET /api/square/callback', () => {
    it('should handle successful OAuth callback', async () => {
      const response = await request(testApp)
        .get('/api/square/callback')
        .query({
          code: 'mock-authorization-code',
          state: 'some-state'
        })
        .expect(302) // Expect a redirect
        .expect('Location', 'http://localhost:5173/');
    });

    it('should handle OAuth callback failure', async () => {
      const response = await request(testApp)
        .get('/api/square/callback')
        .query({ error: 'access_denied' })
        .expect(302)
        .expect('Location', '/square-connection-failed');
    });
  });
});
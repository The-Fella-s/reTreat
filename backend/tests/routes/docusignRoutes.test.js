// src/tests/docusignRoutes.test.js

const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const docusign = require('docusign-esign');
const docusignRoutes = require('../../routes/docusignRoutes');
const User = require('../../models/User');
const { protect } = require('../../middleware/authMiddleware');

// Mock dependencies
jest.mock('fs');
jest.mock('path');
jest.mock('docusign-esign');
jest.mock('../../models/User');
jest.mock('../../middleware/authMiddleware');

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use('/docusign', docusignRoutes);

// Mock environment variables
process.env.DOCUSIGN_CLIENT_ID = 'mock-client-id';
process.env.DOCUSIGN_CLIENT_SECRET = 'mock-client-secret';
process.env.DOCUSIGN_REDIRECT_URI = 'http://localhost:3000/docusign/callback';
process.env.DOCUSIGN_BASE_URL = 'https://demo.docusign.net/restapi';
process.env.DOCUSIGN_ACCOUNT_ID = 'mock-account-id';

describe('DocuSign Routes', () => {
  // Setup global mocks and spies
  let mockApiClient;
  let mockEnvelopesApi;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock auth middleware to pass through and add a mock user
    protect.mockImplementation((req, res, next) => {
      req.user = { _id: 'user123' };
      next();
    });
    
    // Setup docusign API client mocks
    mockApiClient = {
      setBasePath: jest.fn(),
      getAuthorizationUri: jest.fn().mockReturnValue('https://mock-auth-url.com'),
      generateAccessToken: jest.fn().mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600
      }),
      refreshAccessToken: jest.fn().mockResolvedValue({
        accessToken: 'mock-refreshed-token',
        refreshToken: 'mock-new-refresh-token',
        expiresIn: 3600
      }),
      addDefaultHeader: jest.fn()
    };
    
    // Setup mock envelopes API
    mockEnvelopesApi = {
      createEnvelope: jest.fn().mockResolvedValue({
        envelopeId: 'mock-envelope-id',
        status: 'sent'
      }),
      getEnvelope: jest.fn().mockResolvedValue({
        envelopeId: 'mock-envelope-id',
        status: 'sent',
        statusChangedDateTime: new Date().toISOString()
      })
    };
    
    // Setup docusign module mocks
    docusign.ApiClient.mockImplementation(() => mockApiClient);
    docusign.EnvelopeDefinition.mockImplementation(() => ({}));
    docusign.Document.mockImplementation(() => ({}));
    docusign.Signer.mockImplementation(() => ({}));
    docusign.SignHere.mockImplementation(() => ({}));
    docusign.Tabs.mockImplementation(() => ({}));
    docusign.Recipients.mockImplementation(() => ({}));
    docusign.EnvelopesApi.mockImplementation(() => mockEnvelopesApi);
    
    // Mock file system operations
    fs.readFileSync.mockReturnValue(Buffer.from('mock document content'));
    path.resolve.mockReturnValue('/mock/path/to/document.pdf');
    path.extname.mockReturnValue('.pdf');
  });
  
  describe('GET /docusign/test', () => {
    test('should return 200 with a success message', async () => {
      const response = await request(app).get('/docusign/test');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'DocuSign route is working!');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
  
  describe('GET /docusign/auth', () => {
    test('should return authorization URL', async () => {
      const response = await request(app).get('/docusign/auth');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('authUrl', 'https://mock-auth-url.com');
      expect(mockApiClient.getAuthorizationUri).toHaveBeenCalledWith(
        'mock-client-id',
        ['signature', 'impersonation'],
        'http://localhost:3000/docusign/callback',
        'code'
      );
    });
    
    test('should handle errors and return 500', async () => {
      // Arrange: simulate an error
      mockApiClient.getAuthorizationUri.mockImplementation(() => {
        throw new Error('API error');
      });
      
      const response = await request(app).get('/docusign/auth');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Failed to generate authentication URL');
    });
  });
  
  describe('GET /docusign/callback', () => {
    test('should process the authorization code and return success', async () => {
      const response = await request(app).get('/docusign/callback?code=mock-auth-code');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'DocuSign authentication successful');
      expect(mockApiClient.generateAccessToken).toHaveBeenCalledWith(
        'mock-client-id',
        'mock-client-secret',
        'mock-auth-code'
      );
    });
    
    test('should return 400 if code is missing', async () => {
      const response = await request(app).get('/docusign/callback');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Authorization code is missing');
    });
    
    test('should handle errors and return 500', async () => {
      // Arrange: simulate an API error
      mockApiClient.generateAccessToken.mockRejectedValue(new Error('API error'));
      
      const response = await request(app).get('/docusign/callback?code=mock-auth-code');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Failed to process DocuSign authentication');
    });
  });
  
  describe('POST /docusign/create-envelope', () => {
    test('should create and send envelope successfully', async () => {
      // Arrange: mock user with valid token
      User.findById = jest.fn().mockResolvedValue({
        _id: 'user123',
        docusignAccessToken: 'valid-token',
        docusignExpiresIn: Date.now() + 3600000 // Not expired
      });
      
      const requestBody = {
        documentPath: '/path/to/document.pdf',
        signerEmail: 'signer@example.com',
        signerName: 'Test Signer',
        documentName: 'Test Document',
        emailSubject: 'Please sign this test document',
        emailBody: 'This is a test document for signing'
      };
      
      const response = await request(app).post('/docusign/create-envelope').send(requestBody);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('envelopeId', 'mock-envelope-id');
      expect(response.body).toHaveProperty('status', 'sent');
      expect(mockEnvelopesApi.createEnvelope).toHaveBeenCalled();
    });
    
    test('should return 400 if required parameters are missing', async () => {
      // Missing required fields
      const requestBody = {
        signerEmail: 'signer@example.com'
        // Missing other required fields
      };
      
      const response = await request(app).post('/docusign/create-envelope').send(requestBody);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Missing required parameters');
    });
    
    test('should refresh token if expired and proceed with request', async () => {
      // Arrange: mock user with expired token
      User.findById = jest.fn().mockResolvedValue({
        _id: 'user123',
        docusignAccessToken: 'expired-token',
        docusignRefreshToken: 'refresh-token',
        docusignExpiresIn: Date.now() - 3600000 // Expired 1 hour ago
      });
      
      User.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      
      const requestBody = {
        documentPath: '/path/to/document.pdf',
        signerEmail: 'signer@example.com',
        signerName: 'Test Signer',
        documentName: 'Test Document'
      };
      
      const response = await request(app).post('/docusign/create-envelope').send(requestBody);
      
      expect(response.status).toBe(200);
      expect(mockApiClient.refreshAccessToken).toHaveBeenCalled();
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user123', expect.objectContaining({
        docusignAccessToken: 'mock-refreshed-token',
        docusignRefreshToken: 'mock-new-refresh-token'
      }));
      expect(mockEnvelopesApi.createEnvelope).toHaveBeenCalled();
    });
    
    test('should return 500 if envelope creation fails', async () => {
      // Arrange: mock user with valid token
      User.findById = jest.fn().mockResolvedValue({
        _id: 'user123',
        docusignAccessToken: 'valid-token',
        docusignExpiresIn: Date.now() + 3600000
      });
      
      // Simulate API error
      mockEnvelopesApi.createEnvelope.mockRejectedValue(new Error('API error'));
      
      const requestBody = {
        documentPath: '/path/to/document.pdf',
        signerEmail: 'signer@example.com',
        signerName: 'Test Signer',
        documentName: 'Test Document'
      };
      
      const response = await request(app).post('/docusign/create-envelope').send(requestBody);
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Failed to create envelope');
    });
  });
  
  describe('GET /docusign/envelopes/:envelopeId', () => {
    test('should return envelope status', async () => {
      // Arrange: mock user with valid token
      User.findById = jest.fn().mockResolvedValue({
        _id: 'user123',
        docusignAccessToken: 'valid-token',
        docusignExpiresIn: Date.now() + 3600000
      });
      
      const response = await request(app).get('/docusign/envelopes/mock-envelope-id');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('envelopeId', 'mock-envelope-id');
      expect(response.body).toHaveProperty('status', 'sent');
      expect(mockEnvelopesApi.getEnvelope).toHaveBeenCalledWith(
        'mock-account-id',
        'mock-envelope-id'
      );
    });
    
    test('should return 500 if getting envelope status fails', async () => {
      // Arrange: mock user with valid token
      User.findById = jest.fn().mockResolvedValue({
        _id: 'user123',
        docusignAccessToken: 'valid-token',
        docusignExpiresIn: Date.now() + 3600000
      });
      
      // Simulate API error
      mockEnvelopesApi.getEnvelope.mockRejectedValue(new Error('API error'));
      
      const response = await request(app).get('/docusign/envelopes/mock-envelope-id');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Failed to get envelope status');
    });
  });
  
  describe('Authentication client functions', () => {
    test('should throw error if user has no DocuSign token', async () => {
      // Arrange: mock user without token
      User.findById = jest.fn().mockResolvedValue({
        _id: 'user123',
        // No docusignAccessToken
      });
      
      const requestBody = {
        documentPath: '/path/to/document.pdf',
        signerEmail: 'signer@example.com',
        signerName: 'Test Signer',
        documentName: 'Test Document'
      };
      
      const response = await request(app).post('/docusign/create-envelope').send(requestBody);
      
      expect(response.status).toBe(500);
      expect(User.findById).toHaveBeenCalledWith('user123');
    });
    
    test('should throw error if user not found', async () => {
      // Arrange: no user found
      User.findById = jest.fn().mockResolvedValue(null);
      
      const requestBody = {
        documentPath: '/path/to/document.pdf',
        signerEmail: 'signer@example.com',
        signerName: 'Test Signer',
        documentName: 'Test Document'
      };
      
      const response = await request(app).post('/docusign/create-envelope').send(requestBody);
      
      expect(response.status).toBe(500);
      expect(User.findById).toHaveBeenCalledWith('user123');
    });
  });
});
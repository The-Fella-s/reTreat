// Set env vars BEFORE importing the router
process.env.DOCUSIGN_CLIENT_ID = 'mock-client-id';
process.env.DOCUSIGN_CLIENT_SECRET = 'mock-client-secret';
process.env.DOCUSIGN_REDIRECT_URI = 'http://localhost/callback';
process.env.DOCUSIGN_ACCOUNT_ID = 'mock-account-id';

const request = require('supertest');
const express = require('express');
const axios = require('axios');
const docusign = require('docusign-esign');
const router = require('../../routes/docusignRoutes'); // update path if needed

jest.mock('axios');
jest.mock('docusign-esign');

const app = express();
app.use(express.json());
app.use('/', router);

describe('DocuSign Auth Routes', () => {
  test('GET /auth-url returns correct URL', async () => {
    const res = await request(app).get('/auth-url');

    expect(res.statusCode).toBe(200);
    expect(res.body.url).toContain('https://account-d.docusign.com/oauth/auth');
    expect(res.body.url).toContain(`client_id=${process.env.DOCUSIGN_CLIENT_ID}`);
    expect(res.body.url).toContain(`redirect_uri=${encodeURIComponent(process.env.DOCUSIGN_REDIRECT_URI)}`);
  });

  test('GET /callback exchanges code for token successfully', async () => {
    const mockToken = 'mock-access-token';

    axios.post.mockResolvedValueOnce({ data: { access_token: mockToken } });

    const res = await request(app).get('/callback').query({ code: 'mock-code' });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBe(mockToken);
    expect(res.body.message).toBe('You can now send documents');
  });

  test('GET /callback returns 500 on failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Token exchange error'));

    const res = await request(app).get('/callback').query({ code: 'bad-code' });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Token exchange failed');
    expect(res.body.error).toBeDefined();
  });

  test('POST /send-envelope sends document successfully', async () => {
    const mockCreateEnvelope = jest.fn().mockResolvedValue({ envelopeId: '123456' });

    docusign.ApiClient.mockImplementation(() => ({
      setBasePath: jest.fn(),
      addDefaultHeader: jest.fn(),
    }));

    docusign.EnvelopesApi.mockImplementation(() => ({
      createEnvelope: mockCreateEnvelope,
    }));

    docusign.EnvelopeDefinition.mockImplementation(() => ({}));

    const res = await request(app)
      .post('/send-envelope')
      .send({
        accessToken: 'mock-token',
        customerEmail: 'test@example.com',
        customerName: 'John Doe',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Envelope sent!');
    expect(res.body.envelopeId).toBe('123456');
    expect(mockCreateEnvelope).toHaveBeenCalled();
  });

  test('POST /send-envelope handles error from DocuSign SDK', async () => {
    docusign.ApiClient.mockImplementation(() => ({
      setBasePath: jest.fn(),
      addDefaultHeader: jest.fn(),
    }));

    docusign.EnvelopesApi.mockImplementation(() => ({
      createEnvelope: jest.fn().mockRejectedValue(new Error('DocuSign error')),
    }));

    docusign.EnvelopeDefinition.mockImplementation(() => ({}));

    const res = await request(app)
      .post('/send-envelope')
      .send({
        accessToken: 'mock-token',
        customerEmail: 'fail@example.com',
        customerName: 'Error User',
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Failed to send document');
  });
});

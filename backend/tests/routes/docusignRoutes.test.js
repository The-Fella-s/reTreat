// tests/routes/docusignRoutes.test.js

process.env.DOCUSIGN_ACCOUNT_ID = 'mock-account-id';
process.env.DOCUSIGN_BASE_URL = 'https://mock.docusign.net/restapi';
process.env.FRONTEND_BASE_URL = 'http://localhost:5173';

const request = require('supertest');
const express = require('express');
const docusign = require('docusign-esign');
const router = require('../../routes/docusignRoutes');

jest.mock('../../lib/docusign-jwt', () => ({
  getJwtApiClient: jest.fn().mockResolvedValue({
    setBasePath: jest.fn(),
  }),
}));

jest.mock('../../models/Waiver', () => ({
  findByIdAndUpdate: jest.fn().mockResolvedValue({}),
  findById: jest.fn().mockResolvedValue({ envelopeId: 'mock-envelope-id', _id: 'mock-id' }),
}));

jest.mock('docusign-esign');

const app = express();
app.use(express.json());
app.use('/', router);

describe('DocuSign Routes', () => {
  beforeEach(() => {
    docusign.EnvelopesApi.mockClear();
    docusign.RecipientViewRequest.constructFromObject = jest.fn().mockReturnValue({});
    docusign.EnvelopeDefinition.mockImplementation(() => ({}));
    docusign.Signer = {
      constructFromObject: jest.fn().mockReturnValue({}),
    };
    docusign.Tabs = {
      constructFromObject: jest.fn().mockReturnValue({}),
    };
    docusign.Recipients = {
      constructFromObject: jest.fn().mockReturnValue({}),
    };
  });

  test('POST /send-envelope sends document and returns signing URL', async () => {
    const mockCreateEnvelope = jest.fn().mockResolvedValue({ envelopeId: '123456' });
    const mockCreateRecipientView = jest.fn().mockResolvedValue({ url: 'https://mock-signing-url.com' });

    docusign.EnvelopesApi.mockImplementation(() => ({
      createEnvelope: mockCreateEnvelope,
      createRecipientView: mockCreateRecipientView,
    }));

    const res = await request(app).post('/send-envelope').send({
      customerEmail: 'john@example.com',
      customerName: 'John Doe',
      clientUserId: 'abc123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.envelopeId).toBe('123456');
    expect(res.body.signingUrl).toBe('https://mock-signing-url.com');
    expect(mockCreateEnvelope).toHaveBeenCalled();
    expect(mockCreateRecipientView).toHaveBeenCalled();
  });

  test('POST /send-envelope handles errors gracefully', async () => {
    docusign.EnvelopesApi.mockImplementation(() => ({
      createEnvelope: jest.fn().mockRejectedValue(new Error('Mock DocuSign failure')),
    }));

    const res = await request(app).post('/send-envelope').send({
      customerEmail: 'error@example.com',
      customerName: 'Error Case',
      clientUserId: 'fail123',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('DocuSign error');
    expect(res.body.error).toBeDefined();
  });

  test('GET /envelopes/:id/document returns PDF buffer', async () => {
    const mockPdf = Buffer.from('%PDF-1.4 mock PDF content');

    docusign.EnvelopesApi.mockImplementation(() => ({
      getDocument: jest.fn().mockResolvedValue(mockPdf),
    }));

    const res = await request(app).get('/envelopes/mock-id/document');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.headers['content-disposition']).toContain('inline; filename=waiver-mock-id.pdf');
    expect(res.body).toBeInstanceOf(Buffer);
  });

  test('GET /envelopes/:id/document returns 404 if no envelope', async () => {
    const Waiver = require('../../models/Waiver');
    Waiver.findById.mockResolvedValueOnce(null);

    const res = await request(app).get('/envelopes/unknown-id/document');

    expect(res.statusCode).toBe(404);
  });

  test('GET /envelopes/:id/document handles fetch error', async () => {
    docusign.EnvelopesApi.mockImplementation(() => ({
      getDocument: jest.fn().mockRejectedValue(new Error('Doc error')),
    }));

    const res = await request(app).get('/envelopes/mock-id/document');

    expect(res.statusCode).toBe(500);
  });
});

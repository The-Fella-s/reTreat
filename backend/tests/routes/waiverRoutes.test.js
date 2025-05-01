const request = require('supertest');
const express = require('express');

// Stub out auth middleware so we can control req.user
jest.mock('../../middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    // Simulate an authenticated user (with admin privileges by default)
    req.user = { id: 'user123', role: 'admin' };
    return next();
  },
  adminOnly: (req, res, next) => next(),
}));
jest.mock('../../middleware/optionalAuth', () => (req, res, next) => {
  // optionalAuth: don’t add a user by default
  return next();
});

// Mock the Mongoose model
jest.mock('../../models/Waiver');
const Waiver = require('../../models/Waiver');

const waiverRouter = require('../../routes/waiverRoutes');

describe('Waiver Routes', () => {
  let app;
  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/waivers', waiverRouter);
  });

  describe('POST /waivers', () => {
    it('should 400 if waiverType or formData missing', async () => {
      const res = await request(app).post('/waivers').send({ waiverType: 'A' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/waiverType and formData are required/);
    });

    it('should 201 and return waiver on success', async () => {
      const fakeWaiver = { _id: 'w1', waiverType: 'A', formData: { foo: 'bar' } };
      Waiver.create.mockResolvedValueOnce(fakeWaiver);

      const res = await request(app)
        .post('/waivers')
        .send({ waiverType: 'A', formData: { foo: 'bar' } });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(fakeWaiver);
      expect(Waiver.create).toHaveBeenCalledWith({ waiverType: 'A', formData: { foo: 'bar' }, user: undefined });
    });

    it('should 500 if create throws', async () => {
      Waiver.create.mockRejectedValueOnce(new Error('fail'));
      const res = await request(app)
        .post('/waivers')
        .send({ waiverType: 'A', formData: { foo: 'bar' } });

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Error saving waiver/);
    });
  });

  describe('GET /waivers', () => {
    it('should return JSON list of all waivers', async () => {
      const waivers = [{ id: 1 }, { id: 2 }];
      Waiver.find.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce(waivers),
      });

      const res = await request(app).get('/waivers');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(waivers);
    });
  });

  describe('GET /waivers/my', () => {
    it('should return only this user’s waivers', async () => {
      const myWaivers = [{ id: 'w1' }];
      Waiver.find.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce(myWaivers),
      });

      const res = await request(app).get('/waivers/my');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(myWaivers);
      expect(Waiver.find).toHaveBeenCalledWith({ user: 'user123' });
    });

    it('should 500 on error', async () => {
      Waiver.find.mockImplementationOnce(() => { throw new Error(); });
      const res = await request(app).get('/waivers/my');
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Error fetching your waivers/);
    });
  });

  describe('PUT /waivers/:id/approve', () => {
    it('should 404 if waiver not found', async () => {
      Waiver.findById.mockResolvedValueOnce(null);
      const res = await request(app).put('/waivers/abc/approve');
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/Waiver not found/);
    });

    it('should approve and return waiver', async () => {
      const waiver = { save: jest.fn(), status: 'pending' };
      Waiver.findById.mockResolvedValueOnce(waiver);

      const res = await request(app).put('/waivers/abc/approve');
      expect(res.status).toBe(200);
      expect(waiver.status).toBe('approved');
      expect(waiver.save).toHaveBeenCalled();
      expect(res.body).toEqual({ status: 'approved' });
    });

    it('should 500 on error', async () => {
      Waiver.findById.mockImplementationOnce(() => { throw new Error(); });
      const res = await request(app).put('/waivers/abc/approve');
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Error approving waiver/);
    });
  });

  describe('PUT /waivers/:id/reject', () => {
    it('should 404 if waiver not found', async () => {
      Waiver.findById.mockResolvedValueOnce(null);
      const res = await request(app).put('/waivers/xyz/reject');
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/Waiver not found/);
    });

    it('should reject and return waiver', async () => {
      const waiver = { save: jest.fn(), status: 'pending' };
      Waiver.findById.mockResolvedValueOnce(waiver);

      const res = await request(app).put('/waivers/xyz/reject');
      expect(res.status).toBe(200);
      expect(waiver.status).toBe('rejected');
      expect(waiver.save).toHaveBeenCalled();
      expect(res.body).toEqual({ status: 'rejected' });
    });

    it('should 500 on error', async () => {
      Waiver.findById.mockImplementationOnce(() => { throw new Error(); });
      const res = await request(app).put('/waivers/xyz/reject');
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Error rejecting waiver/);
    });
  });
});

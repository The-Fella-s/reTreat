const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');

jest.mock('../../models/Services');
jest.mock('../../models/Category');
jest.mock('../../utilities/helpers/categoryHelpers');
jest.mock('axios');

const Services = require('../../models/Services');
const Category = require('../../models/Category');
const { createCategory, deleteCategory } = require('../../utilities/helpers/categoryHelpers');
const axios = require('axios');
const servicesRouter = require('../../routes/servicesRoutes');

describe('Services Routes', () => {
  let app;

  beforeAll(() => {
    // ensure upload dir exists for the file‐upload test
    fs.mkdirSync(path.join(process.cwd(), 'uploads/services'), { recursive: true });
  });

  afterAll(() => {
    // clean up upload dir
    fs.rmSync(path.join(process.cwd(), 'uploads'), { recursive: true, force: true });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/services', servicesRouter);
  });

  describe('GET /services', () => {
    it('should return 200 + JSON list of services', async () => {
      const fakeServices = [{ name: 'S1' }, { name: 'S2' }];
      Services.find.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(fakeServices),
      });

      const res = await request(app).get('/services');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeServices);
      expect(Services.find).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      Services.find.mockImplementationOnce(() => { throw new Error('fail'); });
      const res = await request(app).get('/services');
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Internal Server Error/);
    });
  });

  describe('GET /services/check-existence', () => {
    it('should return exists:true when services exist', async () => {
      Services.find.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce([1]),
      });
      const res = await request(app).get('/services/check-existence');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ exists: true });
    });

    it('should return exists:false when none', async () => {
      Services.find.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce([]),
      });
      const res = await request(app).get('/services/check-existence');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ exists: false });
    });

    it('should return 500 on error', async () => {
      Services.find.mockImplementationOnce(() => { throw new Error(); });
      const res = await request(app).get('/services/check-existence');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /services/:id', () => {
    it('200 + service when found', async () => {
      const svc = { _id: '123', name: 'X' };
      Services.findById.mockResolvedValueOnce(svc);
      const res = await request(app).get('/services/123');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(svc);
    });

    it('404 when not found', async () => {
      Services.findById.mockResolvedValueOnce(null);
      const res = await request(app).get('/services/999');
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/Service not found/);
    });

    it('500 on error', async () => {
      Services.findById.mockRejectedValueOnce(new Error('oops'));
      const res = await request(app).get('/services/123');
      expect(res.status).toBe(500);
    });
  });

  describe('POST /services/populate', () => {
    const payload = {
      services: [{
        name: 'T1',
        description: 'D1',
        pricing: 10,
        duration: 20,
        category: 'CatA',
        variantName: [],
        variantId: [],
        variantPricing: [],
        variantDuration: [],
        servicePicture: 'pic.jpg',
      }],
    };

    it('201 on success and calls external APIs', async () => {
      // skip createCategory branch: return existing category
      Category.findOne.mockResolvedValue({ _id: 'catId', name: 'CatA' });
      Services.updateOne.mockResolvedValue();
      Services.findOne.mockResolvedValue({
        name: 'T1',
        description: 'D1',
        pricing: 10,
        duration: 20,
        category: 'catId',
        variantName: [],
        variantId: [],
        variantPricing: [],
        variantDuration: [],
        servicePicture: 'pic.jpg',
      });
      Category.findById.mockResolvedValue({ name: 'CatA' });
      axios.post.mockResolvedValue();

      const res = await request(app)
        .post('/services/populate')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/Services populated successfully/);
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/catalogs/create',
        expect.objectContaining({ name: 'T1', category: 'CatA' })
      );
    });

    it('500 on error', async () => {
      Category.findOne.mockRejectedValueOnce(new Error('bad'));
      const res = await request(app).post('/services/populate').send(payload);
      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Error populating services/);
    });
  });

  describe('PUT /services/:id', () => {
    const updateBody = {
      name: 'New',
      description: 'D2',
      pricing: 15,
      duration: 25,
      category: 'CatB',
      variantName: [],
      variantId: [],
      variantPricing: [],
      variantDuration: [],
    };

    it('400 if category not found', async () => {
      Category.findOne.mockResolvedValueOnce(null);
      const res = await request(app).put('/services/abc').send(updateBody);
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Category not found/);
    });

    it('404 if service not found', async () => {
      Category.findOne.mockResolvedValue({ _id: 'catB' });
      Services.findByIdAndUpdate.mockResolvedValueOnce(null);
      const res = await request(app).put('/services/abc').send(updateBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/Service not found/);
    });

    it('200 on success and calls catalog update', async () => {
      Category.findOne.mockResolvedValue({ _id: 'catB' });
      const updated = Object.assign({ _id: 'x' }, updateBody, { category: 'catB' });
      Services.findByIdAndUpdate.mockResolvedValueOnce(updated);
      axios.put.mockResolvedValueOnce({ data: { catalog: 'ok' } });

      const res = await request(app).put('/services/x').send(updateBody);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/Service updated successfully/);
      expect(res.body.service).toMatchObject(updated);
      expect(res.body.catalogUpdate).toEqual({ catalog: 'ok' });
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:5000/api/catalogs/update',
        expect.objectContaining({ newName: 'New' }),
        { params: { name: 'New' } }
      );
    });

    it('500 on error', async () => {
      Category.findOne.mockResolvedValue({ _id: 'catB' });
      Services.findByIdAndUpdate.mockRejectedValueOnce(new Error('err'));
      const res = await request(app).put('/services/x').send(updateBody);
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /services/:id', () => {
    it('404 if not found initially', async () => {
      Services.findById.mockResolvedValueOnce(null);
      const res = await request(app).delete('/services/z');
      expect(res.status).toBe(404);
    });

    it('200 when other services remain (no deleteCategory)', async () => {
      Services.findById.mockResolvedValueOnce({ _id: 'z', category: 'catX' });
      Services.findByIdAndDelete.mockResolvedValueOnce({ _id: 'z' });
      Services.countDocuments.mockResolvedValueOnce(2);

      const res = await request(app).delete('/services/z');
      expect(res.status).toBe(200);
      expect(deleteCategory).not.toHaveBeenCalled();
    });

    it('200 and calls deleteCategory when last one', async () => {
      Services.findById.mockResolvedValueOnce({ _id: 'z', category: 'catX' });
      Services.findByIdAndDelete.mockResolvedValueOnce({ _id: 'z' });
      Services.countDocuments.mockResolvedValueOnce(0);
      Category.findById.mockResolvedValueOnce({ name: 'CatX' });

      const res = await request(app).delete('/services/z');
      expect(res.status).toBe(200);
      expect(deleteCategory).toHaveBeenCalledWith(
        expect.anything() /* SquareClient */,
        'CatX'
      );
    });

    it('500 on error', async () => {
      Services.findById.mockRejectedValueOnce(new Error('err'));
      const res = await request(app).delete('/services/z');
      expect(res.status).toBe(500);
    });
  });

  describe('POST /services/upload', () => {
    it('400 when no file attached', async () => {
      const res = await request(app).post('/services/upload');
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/No file uploaded/);
    });

    it('200 when file attached', async () => {
      const res = await request(app)
        .post('/services/upload')
        .attach('servicePicture', Buffer.from('hi'), 'test.png');

      expect(res.status).toBe(200);
      expect(res.body.filePath).toMatch(/\/uploads\/services\/\d+_test\.png$/);
    });
  });
});

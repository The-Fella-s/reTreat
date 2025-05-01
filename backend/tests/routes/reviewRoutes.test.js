const request = require('supertest');
const express = require('express');
const reviewRouter = require('../../routes/reviewRoutes');

const Review = require('../../models/Review');
const Appointment = require('../../models/Appointment');

jest.mock('../../models/Review');
jest.mock('../../models/Appointment');

const app = express();
app.use(express.json());
app.use('/reviews', reviewRouter);


describe('Review Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /reviews', () => {
    it('should return 404 if appointment not found', async () => {
      Appointment.findById.mockResolvedValue(null);
      const res = await request(app)
        .post('/reviews')
        .send({ userId: 'user123', appointmentId: 'appt123', rating: 5, comment: 'Great!' });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/Appointment not found/);
    });

    it('should return 403 if user does not match appointment', async () => {
      Appointment.findById.mockResolvedValue({ _id: 'appt123', user: 'someoneElse', status: 'completed' });
      const res = await request(app)
        .post('/reviews')
        .send({ userId: 'user123', appointmentId: 'appt123', rating: 5, comment: 'Great!' });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Not authorized to review/);
    });

    it('should return 400 if appointment is not completed', async () => {
      Appointment.findById.mockResolvedValue({ _id: 'appt123', user: 'user123', status: 'pending' });
      const res = await request(app)
        .post('/reviews')
        .send({ userId: 'user123', appointmentId: 'appt123', rating: 5, comment: 'Great!' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Appointment must be completed/);
    });

    it('should create a new review', async () => {
      Appointment.findById.mockResolvedValue({ _id: 'appt123', user: 'user123', status: 'completed' });
      Review.create.mockResolvedValue({
        _id: 'rev123',
        user: 'user123',
        appointment: 'appt123',
        rating: 5,
        comment: 'Great!',
      });

      const res = await request(app)
        .post('/reviews')
        .send({ userId: 'user123', appointmentId: 'appt123', rating: 5, comment: 'Great!' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('rating', 5);
      expect(res.body).toHaveProperty('comment', 'Great!');
    });
  });

  describe('PUT /reviews/:reviewId', () => {
    it('should return 404 if review not found', async () => {
      Review.findById.mockResolvedValue(null);
      const res = await request(app)
        .put('/reviews/rev123')
        .send({ userId: 'user123', rating: 4, comment: 'Updated' });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/Review not found/);
    });

    it('should return 403 if user is not the owner', async () => {
      Review.findById.mockResolvedValue({ _id: 'rev123', user: 'someoneElse' });
      const res = await request(app)
        .put('/reviews/rev123')
        .send({ userId: 'user123', rating: 4, comment: 'Updated' });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Not authorized to edit/);
    });

    it('should update the review', async () => {
      const saveMock = jest.fn().mockResolvedValue(true);
      const reviewMock = { _id: 'rev123', user: 'user123', rating: 3, comment: 'Old', save: saveMock };

      Review.findById.mockResolvedValue(reviewMock);
      const res = await request(app)
        .put('/reviews/rev123')
        .send({ userId: 'user123', rating: 4, comment: 'Updated' });

      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body.rating).toBe(4);
    });
  });

  describe('DELETE /reviews/:reviewId', () => {
    it('should return 404 if review not found', async () => {
      Review.findById.mockResolvedValue(null);
      const res = await request(app)
        .delete('/reviews/rev123')
        .send({ userId: 'user123' });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/Review not found/);
    });

    it('should return 403 if user is not the owner', async () => {
      Review.findById.mockResolvedValue({ _id: 'rev123', user: 'someoneElse' });
      const res = await request(app)
        .delete('/reviews/rev123')
        .send({ userId: 'user123' });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Not authorized to delete/);
    });

    it('should delete the review', async () => {
      const deleteMock = jest.fn().mockResolvedValue(true);
      Review.findById.mockResolvedValue({ _id: 'rev123', user: 'user123', deleteOne: deleteMock });

      const res = await request(app)
        .delete('/reviews/rev123')
        .send({ userId: 'user123' });

      expect(deleteMock).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/);
    });
  });
});

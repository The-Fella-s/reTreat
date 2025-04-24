const request = require('supertest');
const express = require('express');
const reviewsRouter = require('./../../routes/googleRoutes'); 
const axios = require('axios');


jest.mock('axios');

const app = express();
app.use('/', reviewsRouter);

describe('GET /reviews', () => {
    it('should return reviews when Google API responds with reviews', async () => {
        const mockReviews = [
            { author_name: 'Alice', text: 'Great place!' },
            { author_name: 'Bob', text: 'Very relaxing.' }
        ];

        axios.get.mockResolvedValue({
            data: {
                result: {
                    reviews: mockReviews
                }
            }
        });

        const response = await request(app).get('/reviews');

        expect(response.status).toBe(200);
        expect(response.body.reviews).toEqual(mockReviews);
    });

    it('should return 404 when no reviews are found', async () => {
        axios.get.mockResolvedValue({
            data: {
                result: {} 
            }
        });

        const response = await request(app).get('/reviews');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Reviews not found');
    });

    it('should return 500 when there is an error fetching reviews', async () => {
        axios.get.mockRejectedValue(new Error('API failure'));

        const response = await request(app).get('/reviews');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error fetching reviews');
    });
});

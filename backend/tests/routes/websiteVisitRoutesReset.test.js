const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const WebsiteVisit = require('../models/WebsiteVisit'); // adjust path as needed
const websiteVisitRoutes = require('../routes/websiteVisitsRoutes');

const app = express();
app.use(express.json());
app.use('/api/website-visits', websiteVisitRoutes);

beforeAll(async () => {
    const MONGO_TEST_URI = 'mongodb://127.0.0.1:27017/test_website_visits';
    await mongoose.connect(MONGO_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // clear test db
    await mongoose.disconnect();
});

describe('POST /api/website-visits/reset', () => {
    it('should reset website visits to 0', async () => {
        // seed test data
        await WebsiteVisit.findOneAndUpdate(
            {},
            {
                totalVisits: 123,
                dailyVisits: {
                    Monday: 10,
                    Tuesday: 20,
                    Wednesday: 30,
                    Thursday: 40,
                    Friday: 50,
                    Saturday: 60,
                    Sunday: 70
                }
            },
            { upsert: true }
        );

        const response = await request(app).post('/api/website-visits/reset');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.totalVisits).toBe(0);
        expect(response.body.dailyVisits.Monday).toBe(0);
        expect(response.body.dailyVisits.Sunday).toBe(0);
    });
});

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const WebsiteVisit = require('../../models/WebsiteVisit');
const websiteVisitRoutes = require('../../routes/websiteVisitRoutes');

const app = express();
app.use(express.json());
app.use('/api/website-visits', websiteVisitRoutes);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('POST /api/website-visits/reset', () => {
    it('should reset website visits to 0', async () => {
        // Seed test data
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

// src/tests/instagramRoutes.test.js

const request = require('supertest');
const express = require('express');
const instagramRoutes = require('../../routes/instagramRoutes');
const User = require('../../models/instagramBusinessAccount');
const InstagramPosts = require('../../models/InstagramPosts');
const axios = require('axios');

jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/instagram', instagramRoutes);

describe('Instagram Routes - /posts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return cached posts if cache is valid', async () => {
        const now = new Date();

        // Arrange: simulate a valid user with required tokens
        User.findOne = jest.fn().mockResolvedValue({
            pageAccessToken: 'validPageToken',
            igBusinessAccountId: 'businessId',
        });

        // Create a Date object 30 minutes ago
        const recentDate = new Date(now.getTime() - 30 * 60 * 1000);
        const cachedPostsData = [
            { id: '1', media_url: 'http://example.com/1', permalink: 'http://example.com/1', fetchedAt: recentDate },
        ];
        InstagramPosts.find = jest.fn().mockResolvedValue(cachedPostsData);

        const response = await request(app).get('/instagram/posts');

        expect(response.status).toBe(200);
        expect(response.body.source).toBe('cache');

        // Compare date strings since JSON serialization converts Dates to strings.
        const returnedPost = response.body.data[0];
        const expectedPost = cachedPostsData[0];
        expect(returnedPost.id).toBe(expectedPost.id);
        expect(returnedPost.media_url).toBe(expectedPost.media_url);
        expect(returnedPost.permalink).toBe(expectedPost.permalink);
        expect(new Date(returnedPost.fetchedAt).toISOString()).toEqual(expectedPost.fetchedAt.toISOString());

        expect(User.findOne).toHaveBeenCalled();
        expect(InstagramPosts.find).toHaveBeenCalled();
        expect(axios.get).not.toHaveBeenCalled();
    });

    test('should fetch posts from API when cache is expired and cache them', async () => {
        const now = new Date();

        // Arrange: valid user
        User.findOne = jest.fn().mockResolvedValue({
            pageAccessToken: 'validPageToken',
            igBusinessAccountId: 'businessId',
        });

        // Simulate an expired cache (posts fetched 2 hours ago)
        const expiredDate = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        const expiredCachedPosts = [
            { id: '1', media_url: 'http://example.com/old', permalink: 'http://example.com/old', fetchedAt: expiredDate },
        ];
        InstagramPosts.find = jest.fn().mockResolvedValue(expiredCachedPosts);
        InstagramPosts.deleteMany = jest.fn().mockResolvedValue();
        InstagramPosts.bulkWrite = jest.fn().mockResolvedValue();

        // Mock axios to return fresh posts from the API
        const freshPostsFromApi = {
            data: {
                data: [
                    { id: '2', media_url: 'http://example.com/new', permalink: 'http://example.com/new' },
                ],
            },
        };
        axios.get.mockResolvedValue(freshPostsFromApi);

        const response = await request(app).get('/instagram/posts');

        expect(response.status).toBe(200);
        expect(response.body.source).toBe('api');
        expect(response.body.data[0]).toHaveProperty('id', '2');
        expect(axios.get).toHaveBeenCalled();
        expect(InstagramPosts.deleteMany).toHaveBeenCalled();
        expect(InstagramPosts.bulkWrite).toHaveBeenCalled();
    });

    test('should return 401 if no valid user token found', async () => {
        // Simulate that no user is found in the database.
        User.findOne = jest.fn().mockResolvedValue(null);

        const response = await request(app).get('/instagram/posts');
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'No valid access token found');
    });

    test('should handle axios errors and return 500', async () => {
        // Arrange: valid user but simulate no cache
        User.findOne = jest.fn().mockResolvedValue({
            pageAccessToken: 'validPageToken',
            igBusinessAccountId: 'businessId',
        });
        InstagramPosts.find = jest.fn().mockResolvedValue([]);

        // Simulate an axios error from the Instagram API.
        const error = new Error('API error');
        error.response = { data: { error: 'Some API error' } };
        axios.get.mockRejectedValue(error);

        // Optionally, spy on console.error to suppress error logs in test output.
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const response = await request(app).get('/instagram/posts');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Failed to fetch Instagram posts');

        consoleErrorSpy.mockRestore();
    });
});
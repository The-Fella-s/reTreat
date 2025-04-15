process.env.ENCRYPTION_KEY = 'test_dummy_encryption_key';

const express = require('express');
const request = require('supertest');
const router = require('../../routes/userRoutes');
const User = require('../../models/User');

// Mock authentication middleware so that it automatically sets a dummy req.user.
jest.mock('../../middleware/authMiddleware', () => ({
    protect: (req, res, next) => {
        req.user = { id: 'testUser', role: 'admin' };
        next();
    },
    selfOnly: (req, res, next) => next(),
}));

// Mock the User model
jest.mock('../../models/User');

describe('User Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/', router);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should return a list of users without passwords', async () => {
            // Create fake user data using John Doe and Jane Smith.
            const fakeUsers = [
                { _id: '1', firstName: 'John', lastName: 'Doe' },
                { _id: '2', firstName: 'Jane', lastName: 'Smith' }
            ];

            // Create a fake query object with a select method.
            const fakeQuery = {
                select: jest.fn().mockResolvedValue(fakeUsers)
            };

            // Mock User.find to return this fake query object.
            User.find.mockReturnValue(fakeQuery);

            // Perform a GET request on '/'.
            const res = await request(app).get('/');

            // Ensure that find and select are called with expected arguments.
            expect(User.find).toHaveBeenCalled();
            expect(fakeQuery.select).toHaveBeenCalledWith('-password');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toEqual(fakeUsers);
        });

        it('should handle errors and return a 500 status code', async () => {
            // Simulate an error when calling User.find().
            const fakeQuery = {
                select: jest.fn().mockRejectedValue(new Error('Fetch error'))
            };
            User.find.mockReturnValue(fakeQuery);

            // Perform a GET request on '/'.
            const res = await request(app).get('/');

            // Verify that a 500 error is returned with the error message.
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message', 'Failed to fetch users');
        });
    });

    describe('PUT /:id', () => {
        it('should update the user data and return the updated user', async () => {
            // Create a fake user starting as John Doe.
            const fakeUser = {
                _id: 'testId',
                firstName: 'John',
                lastName: 'Doe',
                role: 'user',

                // The save function resolves with the user updated to Jane Smith.
                save: jest.fn().mockResolvedValue({
                    _id: 'testId',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    role: 'admin'
                })
            };

            // Simulate finding the user by id.
            User.findById.mockResolvedValue(fakeUser);

            // Prepare update data to change the name to Jane Smith.
            const updateData = {
                firstName: 'Jane',
                lastName: 'Smith',
                role: 'admin'
            };

            // Perform the PUT request.
            const res = await request(app)
                .put('/testId')
                .send(updateData);

            // Ensure the correct calls were made and response is as expected.
            expect(User.findById).toHaveBeenCalledWith('testId');
            expect(fakeUser.save).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                _id: 'testId',
                firstName: 'Jane',
                lastName: 'Smith',
                role: 'admin'
            });
        });

        it('should return a 404 error if the user is not found', async () => {
            // Simulate that the user is not found (return null).
            User.findById.mockResolvedValue(null);

            // Perform the PUT request with a non-existent user id.
            const res = await request(app)
                .put('/nonexistentId')
                .send({ firstName: 'Jane', lastName: 'Smith' });

            // The endpoint should respond with a 404 error.
            expect(User.findById).toHaveBeenCalledWith('nonexistentId');
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'User not found' });
        });

        it('should handle errors during user save and return a 500 status code', async () => {
            // Create a fake user starting as John Doe with a failing save function.
            const fakeUser = {
                _id: 'testId',
                firstName: 'John',
                lastName: 'Doe',
                role: 'user',
                save: jest.fn().mockRejectedValue(new Error('Save error'))
            };

            // Simulate finding the user successfully.
            User.findById.mockResolvedValue(fakeUser);

            // Make a PUT request attempting to update to Jane Smith.
            const res = await request(app)
                .put('/testId')
                .send({ firstName: 'Jane', lastName: 'Smith' });

            // Expect a 500 response with the error message.
            expect(User.findById).toHaveBeenCalledWith('testId');
            expect(fakeUser.save).toHaveBeenCalled();
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Server error' });
        });
    });
});

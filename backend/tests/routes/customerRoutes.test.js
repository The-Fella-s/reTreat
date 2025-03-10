// tests/customerRoutes.test.js
process.env.SQUARE_ACCESS_TOKEN = 'fake-token';

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock the Square module first
const mockSquareCustomers = {
    search: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
};

jest.mock('square', () => {
    return {
        SquareClient: jest.fn().mockImplementation(() => {
            return {
                customers: mockSquareCustomers,
            };
        }),
        SquareEnvironment: { Sandbox: 'sandbox' },
        SquareError: class SquareError extends Error {},
        CustomersApi: jest.fn().mockImplementation(() => {
            return {
                search: mockSquareCustomers.search,
            };
        }),
    };
});

// Override the authentication middleware to bypass auth for testing
jest.mock('../../middleware/authMiddleware', () => ({
    apiOnly: (req, res, next) => next(),
}));

// Explicitly mock the User model so its methods are Jest mock functions
jest.mock('../../models/User', () => {
    return {
        findOne: jest.fn(),
    };
});
const User = require('../../models/User');

// Now import the router that you want to test
const router = require('../../routes/customerRoutes');

describe('Square Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(bodyParser.json());
        app.use('/', router);
        jest.clearAllMocks();
        mockSquareCustomers.search.mockClear();
    });

    describe('POST /create', () => {
        it('returns 400 if email body parameter is missing', async () => {
            const res = await request(app).post('/create');
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Email body parameter is required');
        });

        it('returns 404 if user not found in database', async () => {
            User.findOne.mockResolvedValue(null);
            const res = await request(app).post('/create').send({ email: 'test@example.com' });
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('User not found in database');
        });

        it('creates a new Square customer if none exists and updates the user', async () => {
            const fakeUser = {
                email: 'test@example.com',
                name: 'John Doe',
                phone: '1234567890',
                squareId: null,
                save: jest.fn().mockResolvedValue(true),
            };
            User.findOne.mockResolvedValue(fakeUser);
            mockSquareCustomers.search.mockResolvedValue({ customers: [] });
            const createdCustomer = { customer: { id: 'sq1011' } };
            mockSquareCustomers.create.mockResolvedValue(createdCustomer);

            const res = await request(app)
                .post('/create')
                .send({ email: 'test@example.com' });  // Ensure the email is sent in the body
            expect(mockSquareCustomers.create).toHaveBeenCalled();
            expect(fakeUser.squareId).toBe('sq1011');
            expect(fakeUser.save).toHaveBeenCalled();
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User Square ID created');
        });

        it('creates a new Square customer if none exists and updates the user', async () => {
            const fakeUser = {
                email: 'test@example.com',
                name: 'John Doe',
                phone: '1234567890',
                squareId: null,
                save: jest.fn().mockResolvedValue(true),
            };
            User.findOne.mockResolvedValue(fakeUser);
            mockSquareCustomers.search.mockResolvedValue({ customers: [] });
            const createdCustomer = { customer: { id: 'sq1011' } };
            mockSquareCustomers.create.mockResolvedValue(createdCustomer);

            const res = await request(app)
                .post('/create')
                .send({ email: 'test@example.com' });  // Ensure the email is sent in the body
            expect(mockSquareCustomers.create).toHaveBeenCalled();
            expect(fakeUser.squareId).toBe('sq1011');
            expect(fakeUser.save).toHaveBeenCalled();
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User Square ID created');
        });

    });

    describe('DELETE /delete', () => {
        it('returns 400 if email body parameter is missing', async () => {
            const res = await request(app).delete('/delete');
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Email body parameter is required');
        });

        it('returns 404 if user not found in database on delete', async () => {
            User.findOne.mockResolvedValue(null);  // Mock user not found
            const res = await request(app)
                .delete('/delete')
                .send({ email: 'test@example.com' }); // Send email in request body

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('User not found in database');
        });

        it('deletes the customer successfully', async () => {
            const fakeUser = { email: 'test@example.com', squareId: 'sq1213' };
            User.findOne.mockResolvedValue(fakeUser);
            mockSquareCustomers.search.mockResolvedValueOnce({ customers: [{ id: 'sq1213' }] });
            mockSquareCustomers.delete.mockResolvedValue({ response: { result: 'deleted' } });

            const res = await request(app)
                .delete('/delete')
                .send({ email: 'test@example.com' }); // Send email in request body

            // Ensure this is called with the correct parameter
            expect(mockSquareCustomers.delete).toHaveBeenCalledWith({ customerId: 'sq1213' });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Customer deleted successfully');
            expect(res.body.response).toBeDefined();
        });

    });

    describe('PUT /update', () => {
        it('returns 400 if email body parameter is missing', async () => {
            const res = await request(app).put('/update');
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Email body parameter is required');
        });

        it('returns 404 if user is not found in database', async () => {
            User.findOne.mockResolvedValue(null);
            const res = await request(app)
                .put('/update')
                .send({ email: 'test@example.com', name: 'Jane Doe', phone: '0987654321' });
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('User not found in database');
        });

        it('updates user and calls Square API if user has squareId', async () => {
            const fakeUser = {
                email: 'test@example.com',
                name: 'John Doe',
                phone: '1234567890',
                squareId: 'sq1415',
                save: jest.fn().mockResolvedValue(true),
            };
            User.findOne.mockResolvedValue(fakeUser);
            mockSquareCustomers.update.mockResolvedValue({});

            const res = await request(app)
                .put('/update')
                .send({ email: 'test@example.com', name: 'Jane Doe', phone: '5555555555' });

            // Update the user's name and phone correctly
            expect(fakeUser.name).toBe('Jane Doe');
            expect(fakeUser.phone).toBe('5555555555');
            expect(fakeUser.save).toHaveBeenCalled();
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User information updated successfully in the database and SquareAPI');
            expect(res.body.user.email).toBe('test@example.com');
        });

        it('updates user without calling Square API if user has no squareId', async () => {
            const fakeUser = {
                email: 'test@example.com',
                name: 'John Doe',
                phone: '1234567890',
                squareId: null,
                save: jest.fn().mockResolvedValue(true),
            };
            User.findOne.mockResolvedValue(fakeUser);

            const res = await request(app)
                .put('/update')
                .send({ email: 'test@example.com', name: 'Jane Doe', phone: '5555555555' });

            expect(mockSquareCustomers.update).not.toHaveBeenCalled();
            expect(fakeUser.name).toBe('Jane Doe');
            expect(fakeUser.phone).toBe('5555555555');
            expect(fakeUser.save).toHaveBeenCalled();
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User information updated successfully in the database and SquareAPI');
            expect(res.body.user.email).toBe('test@example.com');
        });
    });

    describe('GET /list', () => {
        it('returns a list of customers from the Square API', async () => {
            const fakeListResponse = { data: [{ id: 'sq111' }] };
            mockSquareCustomers.list.mockResolvedValue(fakeListResponse);

            const res = await request(app).get('/list');
            expect(mockSquareCustomers.list).toHaveBeenCalledWith({ count: true });
            expect(res.status).toBe(200);

            // Adjust the comparison to match the structure of the response
            const responseData = JSON.parse(res.text);
            expect(responseData).toEqual(fakeListResponse);
        });
    });

    describe('GET /search', () => {
        it('returns 400 if email body parameter is missing', async () => {
            const res = await request(app).get('/search');
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Email body parameter is required');
        });

        it('returns 404 if user not found in database', async () => {
            User.findOne.mockResolvedValue(null);
            const res = await request(app).get('/search').send({ email: 'test@example.com' });
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('User not found in database');
        });

        it('returns squareId from database if user exists with squareId', async () => {
            const fakeUser = { email: 'test@example.com', squareId: 'sq123' };
            User.findOne.mockResolvedValue(fakeUser);
            const res = await request(app).get('/search').send({ email: 'test@example.com' });
            expect(res.status).toBe(200);
            expect(res.body.squareId).toBe('sq123');
            expect(res.body.source).toBe('Database');
        });

        it('calls Square API if user exists without squareId and returns customers', async () => {
            const fakeUser = { email: 'test@example.com', squareId: undefined };
            User.findOne.mockResolvedValue(fakeUser);
            const fakeCustomers = [{ id: 'sq456' }];
            mockSquareCustomers.search.mockResolvedValue({ customers: fakeCustomers });

            const res = await request(app).get('/search').send({ email: 'test@example.com' });
            expect(mockSquareCustomers.search).toHaveBeenCalledWith({
                count: true,
                query: { filter: { emailAddress: { exact: 'test@example.com' } } },
            });
            expect(res.status).toBe(200);
            // The response was sent as a JSON string, so parse it to compare
            const responseData = JSON.parse(res.text);
            expect(responseData).toEqual(fakeCustomers);
        });
    });

});

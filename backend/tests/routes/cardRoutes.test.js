// routes.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Create an Express app and mount the router
const app = express();
app.use(bodyParser.json());
const router = require('../../routes/cardRoutes'); // adjust the path accordingly
app.use(router);

// --- Mocks ---
jest.mock('../../models/User', () => ({
    findOne: jest.fn()
}));
const User = require('../../models/User');

jest.mock('../../utilities/helpers/cardHelpers', () => ({
    createCard: jest.fn(),
    deleteFirstCard: jest.fn(),
    // Simulate error handling by sending a JSON response with error status
    handleCardError: jest.fn((error, res, next) => {
        res.status(500).json({ error: 'Card error occurred' });
    })
}));
const { createCard, deleteFirstCard, handleCardError } = require('../../utilities/helpers/cardHelpers');

// Mock Square SDK. When the router creates a new client, it will receive this mocked version.
jest.mock('square', () => {
    return {
        SquareClient: jest.fn(() => ({
            cards: {
                list: jest.fn(),
                get: jest.fn()
            }
        })),
        SquareEnvironment: {
            Sandbox: 'sandbox'
        },
        SquareError: class SquareError extends Error {}
    };
});
const { SquareClient } = require('square');
// Retrieve the instance created in the router file (since it's instantiated on module load)
const squareClientInstance = SquareClient.mock.results[0].value;

// --- Tests ---
describe('Route Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // POST /create route
    describe('POST /create', () => {
        const validEmail = 'test@example.com';
        const validUser = { email: validEmail, squareId: 'cust_123', save: jest.fn() };
        const mockCard = { id: 'card_123' };

        test('should return 400 if email is missing', async () => {
            const res = await request(app).post('/create').send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toMatch(/Email query parameter is required/);
        });

        test('should return 404 if user not found', async () => {
            User.findOne.mockResolvedValueOnce(null);
            const res = await request(app).post('/create').send({ email: validEmail });
            expect(User.findOne).toHaveBeenCalledWith({ email: validEmail });
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toMatch(/User not found in database/);
        });

        test('should return 404 if user has no Square account linked', async () => {
            User.findOne.mockResolvedValueOnce({ email: validEmail, squareId: null });
            const res = await request(app).post('/create').send({ email: validEmail });
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toMatch(/User does not have a Square account linked/);
        });

        test('should create card and return card JSON on success', async () => {
            User.findOne.mockResolvedValueOnce(validUser);
            createCard.mockResolvedValueOnce(mockCard);
            // Simulate user.save() resolving successfully
            validUser.save.mockResolvedValueOnce();

            const res = await request(app).post('/create').send({ email: validEmail, someData: 'value' });
            expect(createCard).toHaveBeenCalled();
            expect(validUser.cardId).toBe(mockCard.id);
            expect(validUser.save).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            // Check that the returned JSON includes the card id
            const jsonResponse = JSON.parse(res.text);
            expect(jsonResponse.id).toBe(mockCard.id);
        });

        test('should handle errors via handleCardError', async () => {
            // Force createCard to throw an error so that handleCardError is called
            User.findOne.mockResolvedValueOnce(validUser);
            createCard.mockRejectedValueOnce(new Error('Test error'));
            const res = await request(app).post('/create').send({ email: validEmail });
            expect(handleCardError).toHaveBeenCalled();
            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Card error occurred');
        });
    });

    // GET /retrieve route
    describe('GET /retrieve', () => {
        const validEmail = 'test@example.com';
        const validUser = { email: validEmail, squareId: 'cust_123', cardId: 'card_123' };

        test('should return 400 if email is missing in query', async () => {
            const res = await request(app).get('/retrieve');
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toMatch(/Email query parameter is required/);
        });

        test('should return 404 if user not found', async () => {
            User.findOne.mockResolvedValueOnce(null);
            const res = await request(app).get('/retrieve').query({ email: validEmail });
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toMatch(/User not found in database/);
        });

        test('should return 404 if user has no Square account linked', async () => {
            User.findOne.mockResolvedValueOnce({ email: validEmail, squareId: null });
            const res = await request(app).get('/retrieve').query({ email: validEmail });
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toMatch(/User does not have a Square account linked/);
        });

        test('should return 404 if user has no Card linked', async () => {
            User.findOne.mockResolvedValueOnce({ email: validEmail, squareId: 'cust_123', cardId: null });
            const res = await request(app).get('/retrieve').query({ email: validEmail });
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toMatch(/User does not have a Card linked/);
        });

        test('should return 404 if no cards found in Square response', async () => {
            User.findOne.mockResolvedValueOnce(validUser);
            // Simulate no cards returned
            squareClientInstance.cards.list.mockResolvedValueOnce({ data: [] });
            const res = await request(app).get('/retrieve').query({ email: validEmail });
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toMatch(/No cards found/);
        });

        test('should return 404 if the card is not in the list', async () => {
            User.findOne.mockResolvedValueOnce(validUser);
            // Simulate a list that does not include the user’s cardId
            squareClientInstance.cards.list.mockResolvedValueOnce({ data: [{ id: 'different_card' }] });
            const res = await request(app).get('/retrieve').query({ email: validEmail });
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toMatch(/No cards found/);
        });

        test('should return card details on success', async () => {
            User.findOne.mockResolvedValueOnce(validUser);
            // Return a list containing the user’s cardId
            squareClientInstance.cards.list.mockResolvedValueOnce({ data: [{ id: 'card_123' }] });
            const cardDetails = { id: 'card_123', detail: 'value' };
            squareClientInstance.cards.get.mockResolvedValueOnce(cardDetails);

            const res = await request(app).get('/retrieve').query({ email: validEmail });
            expect(squareClientInstance.cards.list).toHaveBeenCalledWith({ customerId: validUser.squareId });
            expect(squareClientInstance.cards.get).toHaveBeenCalledWith({ cardId: 'card_123' });
            expect(res.statusCode).toBe(200);
            const jsonResponse = JSON.parse(res.text);
            expect(jsonResponse.id).toBe('card_123');
            expect(jsonResponse.detail).toBe('value');
        });
    });

    // PUT /update route
    describe('PUT /update', () => {
        const validEmail = 'test@example.com';
        const validUser = { email: validEmail, squareId: 'cust_123', save: jest.fn() };
        const mockCard = { id: 'card_new' };

        test('should return 400 if email is missing', async () => {
            const res = await request(app).put('/update').send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toMatch(/Email query parameter is required/);
        });

        test('should return 404 if user not found', async () => {
            User.findOne.mockResolvedValueOnce(null);
            const res = await request(app).put('/update').send({ email: validEmail });
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toMatch(/User not found/);
        });

        test('should return 404 if user has no Square account linked', async () => {
            User.findOne.mockResolvedValueOnce({ email: validEmail, squareId: null });
            const res = await request(app).put('/update').send({ email: validEmail });
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toMatch(/User does not have a Square account linked/);
        });

        test('should update the card successfully', async () => {
            User.findOne.mockResolvedValueOnce(validUser);
            deleteFirstCard.mockResolvedValueOnce(); // simulate deletion success
            createCard.mockResolvedValueOnce(mockCard);
            validUser.save.mockResolvedValueOnce();

            const res = await request(app).put('/update').send({ email: validEmail, someData: 'value' });
            expect(deleteFirstCard).toHaveBeenCalledWith(squareClientInstance, validUser.squareId);
            expect(createCard).toHaveBeenCalledWith(squareClientInstance, validUser.squareId, expect.any(Object));
            expect(validUser.save).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/Card updated successfully/);
        });

        test('should handle errors via handleCardError', async () => {
            User.findOne.mockResolvedValueOnce(validUser);
            // Force an error in createCard
            deleteFirstCard.mockResolvedValueOnce();
            createCard.mockRejectedValueOnce(new Error('Test update error'));

            const res = await request(app).put('/update').send({ email: validEmail });
            expect(handleCardError).toHaveBeenCalled();
            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Card error occurred');
        });
    });

    // DELETE /delete route
    describe('DELETE /delete', () => {
        const validEmail = 'test@example.com';
        const validUser = { email: validEmail, squareId: 'cust_123', cardId: 'card_123', save: jest.fn() };

        test('should return 400 if email is missing', async () => {
            const res = await request(app).delete('/delete').send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toMatch(/Email query parameter is required/);
        });

        test('should return 404 if user not found', async () => {
            User.findOne.mockResolvedValueOnce(null);
            const res = await request(app).delete('/delete').send({ email: validEmail });
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toMatch(/User not found/);
        });

        test('should return 404 if user has no Square account', async () => {
            User.findOne.mockResolvedValueOnce({ email: validEmail, squareId: null });
            const res = await request(app).delete('/delete').send({ email: validEmail });
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toMatch(/User does not have a Square account/);
        });

        test('should delete card successfully', async () => {
            User.findOne.mockResolvedValueOnce(validUser);
            deleteFirstCard.mockResolvedValueOnce();
            validUser.save.mockResolvedValueOnce();

            const res = await request(app).delete('/delete').send({ email: validEmail });
            expect(deleteFirstCard).toHaveBeenCalledWith(squareClientInstance, validUser.squareId);
            expect(validUser.save).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/Card deleted successfully/);
        });

        test('should handle errors via handleCardError', async () => {
            User.findOne.mockResolvedValueOnce(validUser);
            deleteFirstCard.mockRejectedValueOnce(new Error('Delete error'));
            const res = await request(app).delete('/delete').send({ email: validEmail });
            expect(handleCardError).toHaveBeenCalled();
            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Card error occurred');
        });
    });
});

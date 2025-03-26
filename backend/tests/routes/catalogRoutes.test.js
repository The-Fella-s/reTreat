// Setup Express and mount the router
const request = require('supertest');
const express = require('express');

// Import the router and dependencies for Catalog endpoints
const catalogRouter = require('../../routes/catalogRoutes');
const Category = require('../../models/Category');
const Services = require('../../models/Services');
const { createCategory } = require('../../utilities/helpers/categoryHelpers');
const { SquareItemBuilder } = require('../../utilities/builders/catalogBuilder');
const { generateIdempotencyKey } = require('../../utilities/helpers/randomGenerator');
const mapJsonToServices = require('../../utilities/mapping');

// Helpers to simulate a chainable query
const mockQueryChain = (result) => ({
    populate: jest.fn().mockResolvedValue(result),
});
const mockQueryChainError = (error) => ({
    populate: jest.fn().mockRejectedValue(error),
});

// Mock the Square Client and its methods
jest.mock('square', () => {
    const client = {
        catalog: {
            object: {
                get: jest.fn(),
                upsert: jest.fn(),
                delete: jest.fn(),
            },
            list: jest.fn(),
        },
    };
    return {
        SquareClient: jest.fn(() => client),
        SquareEnvironment: { Sandbox: 'sandbox' },
    };
});

// Mock external modules
jest.mock('../../models/Category');
jest.mock('../../models/Services');
jest.mock('../../utilities/helpers/categoryHelpers');
jest.mock('../../utilities/builders/catalogBuilder');
jest.mock('../../utilities/helpers/randomGenerator');
jest.mock('../../utilities/mapping');

// Setup a fake chainable builder for SquareItemBuilder
const squareItemBuilderMock = {
    setItemVersion: jest.fn().mockReturnThis(),
    build: jest.fn(),
    updateName: jest.fn().mockReturnThis(),
    updateDescription: jest.fn().mockReturnThis(),
    updateVariationById: jest.fn().mockReturnThis(),
    updateVariationByName: jest.fn().mockReturnThis(),
};

SquareItemBuilder.fromServices.mockReturnValue(squareItemBuilderMock);
generateIdempotencyKey.mockReturnValue('fixed-idempotency-key');

const app = express();
app.use(express.json());
app.use('/', catalogRouter);

// Retrieve the Square client instance from the mock
const { SquareClient } = require('square');
const clientMock = SquareClient.mock.results[0].value;

describe('Catalog Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // POST /create
    describe('POST /create', () => {
        const validBody = {
            name: 'Test Service',
            description: 'Test description',
            pricing: 100,
            duration: 60,
            category: 'Test Category',
            variantName: ['Variant A'],
            variantId: ['var1'],
            variantPricing: [120],
            variantDuration: [70],
        };

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/create')
                .send({ name: 'Only Name' });
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/Missing required fields/);
        });

        it('should create a category if it does not exist and then create a new service', async () => {
            Category.findOne.mockResolvedValueOnce(null);
            createCategory.mockResolvedValueOnce({}); // simulate creation
            Category.findOne.mockResolvedValueOnce({ _id: 'catId123', name: validBody.category });
            Services.findOne.mockReturnValueOnce(mockQueryChain(null));

            const newService = {
                _id: 'serviceId123',
                name: validBody.name,
                description: validBody.description,
                pricing: validBody.pricing,
                duration: validBody.duration,
                category: 'catId123',
                variantName: validBody.variantName,
                variantId: validBody.variantId,
                variantPricing: validBody.variantPricing,
                variantDuration: validBody.variantDuration,
            };
            Services.prototype.save = jest.fn().mockResolvedValue(newService);
            Services.findById.mockReturnValue(mockQueryChain(newService));

            clientMock.catalog.object.get.mockResolvedValue({ object: { version: '0' } });
            squareItemBuilderMock.build.mockReturnValue({ id: 'squareItem' });
            clientMock.catalog.object.upsert.mockResolvedValue({ id: 'squareResId' });
            mapJsonToServices.mockResolvedValue({
                name: validBody.name,
                description: validBody.description,
                pricing: validBody.pricing,
                duration: validBody.duration,
                category: 'catId123',
                squareId: 'squareId123',
                variantName: validBody.variantName,
                variantId: validBody.variantId,
                variantPricing: validBody.variantPricing,
                variantDuration: validBody.variantDuration,
            });
            Services.findOneAndUpdate.mockResolvedValue(newService);

            const response = await request(app)
                .post('/create')
                .send(validBody);
            expect(response.status).toBe(201);
            expect(response.body.message).toMatch(/Catalog created successfully/);
            expect(Services.findOne).toHaveBeenCalled();
            expect(clientMock.catalog.object.upsert).toHaveBeenCalled();
        });

        it('should use the existing category and service if found', async () => {
            Category.findOne.mockResolvedValue({ _id: 'existingCatId', name: validBody.category });
            const existingService = {
                _id: 'serviceIdExisting',
                name: validBody.name,
                description: validBody.description,
                pricing: validBody.pricing,
                duration: validBody.duration,
                category: 'existingCatId',
                squareId: 'squareIdExisting',
                variantName: validBody.variantName,
                variantId: validBody.variantId,
                variantPricing: validBody.variantPricing,
                variantDuration: validBody.variantDuration,
            };
            Services.findOne.mockReturnValue(mockQueryChain(existingService));
            clientMock.catalog.object.get.mockResolvedValue({ object: { version: '123' } });
            squareItemBuilderMock.build.mockReturnValue({ id: 'squareItem' });
            clientMock.catalog.object.upsert.mockResolvedValue({ id: 'squareResId' });
            mapJsonToServices.mockResolvedValue({
                name: validBody.name,
                description: validBody.description,
                pricing: validBody.pricing,
                duration: validBody.duration,
                category: 'existingCatId',
                squareId: 'squareIdUpdated',
                variantName: validBody.variantName,
                variantId: validBody.variantId,
                variantPricing: validBody.variantPricing,
                variantDuration: validBody.variantDuration,
            });
            Services.findOneAndUpdate.mockResolvedValue(existingService);

            const response = await request(app)
                .post('/create')
                .send(validBody);
            expect(response.status).toBe(201);
            expect(Category.findOne).toHaveBeenCalled();
            expect(clientMock.catalog.object.get).toHaveBeenCalledWith({ objectId: existingService.squareId });
        });

        it('should catch errors and return 500', async () => {
            Services.findOne.mockReturnValue(mockQueryChainError(new Error('Test error')));
            const response = await request(app)
                .post('/create')
                .send(validBody);
            expect(response.status).toBe(500);
            expect(response.body.error).toMatch(/Test error/);
        });
    });

    // GET /search
    describe('GET /search', () => {
        it('should return 400 if name query is missing', async () => {
            const response = await request(app).get('/search');
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/Name parameter is missing/);
        });

        it('should return 404 if service not found in database', async () => {
            Services.findOne.mockReturnValue(mockQueryChain(null));
            const response = await request(app)
                .get('/search')
                .query({ name: 'NonExistent' });
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/Service not found in database/);
        });

        it('should return 404 if service not found in Square', async () => {
            const service = { squareId: 'squareId123' };
            Services.findOne.mockReturnValue(mockQueryChain(service));
            clientMock.catalog.object.get.mockResolvedValue(null);
            const response = await request(app)
                .get('/search')
                .query({ name: 'Test Service' });
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/Service does not exist in Square/);
        });

        it('should return 200 and catalog data on success', async () => {
            const service = { squareId: 'squareId123' };
            Services.findOne.mockReturnValue(mockQueryChain(service));
            const squareData = { object: { version: '123' } };
            clientMock.catalog.object.get.mockResolvedValue(squareData);
            const response = await request(app)
                .get('/search')
                .query({ name: 'Test Service' });
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/Catalog obtained successfully/);
            expect(response.body.data).toEqual(expect.any(Object));
        });

        it('should catch errors and return 500', async () => {
            Services.findOne.mockReturnValue(mockQueryChainError(new Error('Test error')));
            const response = await request(app)
                .get('/search')
                .query({ name: 'Test Service' });
            expect(response.status).toBe(500);
            expect(response.body.error).toMatch(/Test error/);
        });
    });

    // DELETE /delete
    describe('DELETE /delete', () => {
        it('should return 400 if name query is missing', async () => {
            const response = await request(app).delete('/delete');
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/Name parameter is missing/);
        });

        it('should return 404 if service not found in database', async () => {
            Services.findOne.mockReturnValue(mockQueryChain(null));
            const response = await request(app)
                .delete('/delete')
                .query({ name: 'Test Service' });
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/Service has already been deleted from the database/);
        });

        it('should return 404 if service not found in Square', async () => {
            const service = { squareId: 'squareId123' };
            Services.findOne.mockReturnValue(mockQueryChain(service));
            clientMock.catalog.object.get.mockResolvedValue(null);
            const response = await request(app)
                .delete('/delete')
                .query({ name: 'Test Service' });
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/Service has already been deleted from Square/);
        });

        it('should delete service successfully', async () => {
            const service = { squareId: 'squareId123', name: 'Test Service' };
            Services.findOne.mockReturnValue(mockQueryChain(service));
            clientMock.catalog.object.get.mockResolvedValue({ object: { version: '123' } });
            clientMock.catalog.object.delete.mockResolvedValue({}); // simulate successful deletion
            Services.deleteOne.mockResolvedValue({ deletedCount: 1 });
            const response = await request(app)
                .delete('/delete')
                .query({ name: 'Test Service' });
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/Service has been deleted successfully/);
        });

        it('should catch errors and return 500', async () => {
            Services.findOne.mockReturnValue(mockQueryChainError(new Error('Test error')));
            const response = await request(app)
                .delete('/delete')
                .query({ name: 'Test Service' });
            expect(response.status).toBe(500);
            expect(response.body.error).toMatch(/Test error/);
        });
    });

    // PUT /update
    describe('PUT /update', () => {
        const validQuery = { name: 'Old Service' };
        const validBody = {
            name: 'New Service',
            description: 'Updated description',
            pricing: 150,
            duration: 75,
            category: 'Updated Category',
            variantName: ['Updated Variant'],
            variantId: ['updVar1'],
            variantPricing: [160],
            variantDuration: [80],
        };

        it('should return 400 if required fields are missing in body', async () => {
            const response = await request(app)
                .put('/update')
                .query(validQuery)
                .send({ description: 'Missing required fields' });
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/Missing required fields/);
        });

        it('should return 400 if query name is missing', async () => {
            const response = await request(app)
                .put('/update')
                .send(validBody);
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/Name query is missing/);
        });

        it('should return 404 if service not found in database', async () => {
            Services.findOne.mockReturnValue(mockQueryChain(null));
            const response = await request(app)
                .put('/update')
                .query(validQuery)
                .send(validBody);
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/Service not found in database/);
        });

        it('should return 404 if service not found in Square', async () => {
            const service = { squareId: 'squareId123', name: 'Old Service' };
            Services.findOne.mockReturnValue(mockQueryChain(service));
            clientMock.catalog.object.get.mockResolvedValue(null);
            const response = await request(app)
                .put('/update')
                .query(validQuery)
                .send(validBody);
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/Service does not exist in Square/);
        });

        it('should update service successfully', async () => {
            const service = { squareId: 'squareId123', name: 'Old Service', category: 'catIdOld' };
            Services.findOne.mockReturnValue(mockQueryChain(service));
            clientMock.catalog.object.get.mockResolvedValue({ object: { version: '123' } });
            squareItemBuilderMock.build.mockReturnValue({ id: 'squareItem' });
            clientMock.catalog.object.upsert.mockResolvedValue({ id: 'squareResId' });
            mapJsonToServices.mockResolvedValue({
                name: validBody.name,
                description: validBody.description,
                pricing: validBody.pricing,
                duration: validBody.duration,
                category: 'catIdUpdated',
                squareId: 'squareIdUpdated',
                variantName: validBody.variantName,
                variantId: validBody.variantId,
                variantPricing: validBody.variantPricing,
                variantDuration: validBody.variantDuration,
            });
            Services.findOneAndUpdate.mockResolvedValue({
                name: validBody.name,
                description: validBody.description,
                pricing: validBody.pricing,
                duration: validBody.duration,
            });
            const response = await request(app)
                .put('/update')
                .query(validQuery)
                .send(validBody);
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/Catalog updated successfully/);
        });

        it('should catch errors and return 500', async () => {
            Services.findOne.mockReturnValue(mockQueryChainError(new Error('Test error')));
            const response = await request(app)
                .put('/update')
                .query(validQuery)
                .send(validBody);
            expect(response.status).toBe(500);
            expect(response.body.error).toMatch(/Test error/);
        });
    });

    // GET /list
    describe('GET /list', () => {
        it('should return 200 and list catalogs', async () => {
            const listResponse = { objects: [{ id: 'item1' }, { id: 'item2' }] };
            clientMock.catalog.list.mockResolvedValue(listResponse);
            const response = await request(app).get('/list');
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/Catalogs listed successfully/);
            expect(response.body.data).toEqual(expect.any(Object));
        });

        it('should catch errors and return 500', async () => {
            clientMock.catalog.list.mockRejectedValue(new Error('Test error'));
            const response = await request(app).get('/list');
            expect(response.status).toBe(500);
            expect(response.body.error).toMatch(/Test error/);
        });
    });
});

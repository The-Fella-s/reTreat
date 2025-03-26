// Reset the modules so the mocks are applied before any modules are loaded
jest.resetModules();

// Start mocking the catalog category endpoints
const mockCatalogCategory = {
    search: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
};

// Mock the Square Client and API
const mockSquareClientInstance = { catalog: mockCatalogCategory };

jest.mock('square', () => ({
    SquareClient: jest.fn().mockImplementation(() => mockSquareClientInstance),
    SquareEnvironment: { Sandbox: 'Sandbox' },
}));

// Mock the category functions
jest.mock('../../utilities/helpers/categoryHelpers', () => ({
    createCategory: jest.fn(),
    searchCategory: jest.fn(),
    deleteCategory: jest.fn(),
    updateCategory: jest.fn(),
}));

// Import the mocked category functions
const {
    createCategory,
    searchCategory,
    deleteCategory,
    updateCategory,
} = require('../../utilities/helpers/categoryHelpers');

// Setup Express and mount the router
const express = require('express');
const request = require('supertest');
const app = express();
app.use(express.json());

// Mock the category routes
const router = require('../../routes/categoryRoutes');
app.use('/api/categories', router);

// Mock testing begins here
describe('Category Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Object.values(mockCatalogCategory).forEach((fn) => fn.mockReset());
    });

    // POST /create
    describe('POST /create', () => {
        it('should return 400 if "name" is missing', async () => {
            const res = await request(app).post('/api/categories/create').send({});
            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Name parameter is missing' });
        });

        it('should create a category and return 200', async () => {
            const fakeResponse = { catalogObject: { id: 'cat123', version: '1' } };
            createCategory.mockResolvedValue(fakeResponse);
            const res = await request(app)
                .post('/api/categories/create')
                .send({ name: 'Test Category' });
            expect(createCategory).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Category created successfully');
            expect(res.body.data).toEqual(fakeResponse);
        });

        it('should return 500 if createCategory throws an error', async () => {
            createCategory.mockRejectedValue(new Error('Creation error'));
            const res = await request(app)
                .post('/api/categories/create')
                .send({ name: 'Test Category' });
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'Creation error');
        });
    });

    // GET /search
    describe('GET /search', () => {
        it('should return 400 if "name" query parameter is missing', async () => {
            const res = await request(app).get('/api/categories/search');
            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Name query parameter is missing' });
        });

        it('should return a category and 200 if found', async () => {
            const fakeResponse = { object: { id: 'cat123', version: '1' } };
            searchCategory.mockResolvedValue(fakeResponse);
            const res = await request(app)
                .get('/api/categories/search')
                .query({ name: 'Test Category' });
            expect(searchCategory).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Category obtained successfully');
            expect(res.body.data).toEqual(fakeResponse);
        });

        it('should return 500 if searchCategory throws an error', async () => {
            searchCategory.mockRejectedValue(new Error('Search error'));
            const res = await request(app)
                .get('/api/categories/search')
                .query({ name: 'Test Category' });
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'Search error');
        });
    });

    // DELETE /delete
    describe('DELETE /delete', () => {
        it('should return 400 if "name" query parameter is missing', async () => {
            const res = await request(app).delete('/api/categories/delete');
            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ error: 'Category name is required' });
        });

        it('should return 404 if category is not found', async () => {
            searchCategory.mockResolvedValue(null);
            const res = await request(app)
                .delete('/api/categories/delete')
                .query({ name: 'NonExistent' });
            expect(searchCategory).toHaveBeenCalled();
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ error: 'Category not found' });
        });

        it('should delete a category and return 200', async () => {
            const fakeCategory = { object: { id: 'cat123' } };
            const fakeDeleteResponse = { deleted: true };
            searchCategory.mockResolvedValue(fakeCategory);
            deleteCategory.mockResolvedValue(fakeDeleteResponse);
            const res = await request(app)
                .delete('/api/categories/delete')
                .query({ name: 'Test Category' });
            expect(searchCategory).toHaveBeenCalled();
            expect(deleteCategory).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Category deleted successfully');
            expect(res.body.data).toEqual(fakeDeleteResponse);
        });

        it('should return 500 if deleteCategory throws an error', async () => {
            const fakeCategory = { object: { id: 'cat123' } };
            searchCategory.mockResolvedValue(fakeCategory);
            deleteCategory.mockRejectedValue(new Error('Delete error'));
            const res = await request(app)
                .delete('/api/categories/delete')
                .query({ name: 'Test Category' });
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'Delete error');
        });
    });

    // PUT /update
    describe('PUT /update', () => {
        it('should return 400 if current or new category name is missing', async () => {
            const res1 = await request(app)
                .put('/api/categories/update')
                .query({})
                .send({ name: 'New Name' });
            expect(res1.statusCode).toBe(400);
            expect(res1.body).toEqual({ error: 'Both current and new category names are required' });

            const res2 = await request(app)
                .put('/api/categories/update')
                .query({ name: 'Old Name' })
                .send({});
            expect(res2.statusCode).toBe(400);
            expect(res2.body).toEqual({ error: 'Both current and new category names are required' });
        });

        it('should return 404 if updateCategory indicates failure', async () => {
            updateCategory.mockResolvedValue(null);
            const res = await request(app)
                .put('/api/categories/update')
                .query({ name: 'Old Name' })
                .send({ name: 'New Name' });
            expect(updateCategory).toHaveBeenCalled();
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ error: 'Failed to update category. Ensure it exists.' });
        });

        it('should update a category and return 200', async () => {
            const fakeUpdateResponse = { catalogObject: { id: 'cat123', version: '2' } };
            updateCategory.mockResolvedValue(fakeUpdateResponse);
            const res = await request(app)
                .put('/api/categories/update')
                .query({ name: 'Old Name' })
                .send({ name: 'New Name' });
            expect(updateCategory).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Category updated successfully');
            expect(res.body.data).toEqual(fakeUpdateResponse);
        });

        it('should return 500 if updateCategory throws an error', async () => {
            updateCategory.mockRejectedValue(new Error('Update error'));
            const res = await request(app)
                .put('/api/categories/update')
                .query({ name: 'Old Name' })
                .send({ name: 'New Name' });
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'Failed to update category');
        });
    });


    // GET /list
    describe('GET /list', () => {
        it('should list categories and return 200', async () => {
            const fakeListResponse = { objects: [{ id: 'cat1' }, { id: 'cat2' }] };
            mockCatalogCategory.search.mockResolvedValue(fakeListResponse);

            // Added query parameter "source" with value "square"
            const res = await request(app).get('/api/categories/list?source=square');
            expect(mockCatalogCategory.search).toHaveBeenCalledWith({ objectTypes: ['CATEGORY'] });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Categories obtained successfully');
            expect(res.body.data).toEqual(fakeListResponse);
        });

        it('should return 500 if catalog.search throws an error', async () => {
            mockCatalogCategory.search.mockRejectedValue(new Error('List error'));
            // Added query parameter "source" with value "square"
            const res = await request(app).get('/api/categories/list?source=square');
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'List error');
        });
    });
});

const request = require('supertest');
const express = require('express');
const themeRoutes = require('../../routes/themeRoutes');
const Theme = require('../../models/Theme');

// Mock theme model
jest.mock('../../models/Theme');

const app = express();
app.use(express.json());
app.use('/api/themes', themeRoutes);

describe('Theme Routes', () => {

    // Clear mocks before next test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/themes', () => {
        it('returns existing themes if any', async () => {
            // Mock Theme.find to return two fake theme objects
            const fakeThemes = [{ _id: '1' }, { _id: '2' }];
            Theme.find.mockResolvedValue(fakeThemes);

            // Send a GET request to /api/themes
            const res = await request(app).get('/api/themes');

            // Verify Theme.find was called
            expect(Theme.find).toHaveBeenCalled();

            // Verify the response status is 200 OK
            expect(res.status).toBe(200);

            // Verify the response body matches the fake themes
            expect(res.body).toEqual(fakeThemes);
        });

        it('creates and returns a default theme when none exist', async () => {
            // Mock Theme.find to return an empty array
            Theme.find.mockResolvedValue([]);

            // Make new Theme() return an instance whose save() resolves to a default theme
            const fakeInstance = {
                isActive: true,
                save: jest.fn().mockResolvedValue({ _id: 'new', isActive: true }),
            };
            Theme.mockImplementation(() => fakeInstance);

            // Send a GET request to /api/themes
            const res = await request(app).get('/api/themes');

            // Verify Theme.find was called
            expect(Theme.find).toHaveBeenCalled();

            // Verify a new Theme({ isActive: true }) was constructed
            expect(Theme).toHaveBeenCalledWith({ isActive: true });

            // Verify save() was called on the new instance
            expect(fakeInstance.save).toHaveBeenCalled();

            // Verify the response status is 200 OK
            expect(res.status).toBe(200);

            // Verify the response body contains the default theme
            expect(res.body).toEqual([{ isActive: true }]);
        });

        it('returns 500 if Theme.find throws an error', async () => {
            // Mock Theme.find to throw an error
            Theme.find.mockRejectedValue(new Error('oops'));

            // Send a GET request to /api/themes
            const res = await request(app).get('/api/themes');

            // Verify the response status is 500 Internal Server Error
            expect(res.status).toBe(500);

            // Verify the error message is returned in the body
            expect(res.body).toHaveProperty('error', 'oops');
        });
    });

    describe('GET /api/themes/active', () => {
        it('returns the active theme when one exists', async () => {
            // Mock Theme.findOne to return a single active theme
            const active = { _id: 'abc', isActive: true };
            Theme.findOne.mockResolvedValue(active);

            // Send a GET request to /api/themes/active
            const res = await request(app).get('/api/themes/active');

            // Verify Theme.findOne was called with { isActive: true }
            expect(Theme.findOne).toHaveBeenCalledWith({ isActive: true });

            // Verify the response status is 200 OK
            expect(res.status).toBe(200);

            // Verify the response body matches the active theme
            expect(res.body).toEqual(active);
        });

        it('returns 404 when no active theme is found', async () => {
            // Mock Theme.findOne to return null
            Theme.findOne.mockResolvedValue(null);

            // Send a GET request to /api/themes/active
            const res = await request(app).get('/api/themes/active');

            // Verify the response status is 404 Not Found
            expect(res.status).toBe(404);

            // Verify the error message is returned in the body
            expect(res.body).toEqual({ error: 'No active theme found' });
        });

        it('returns 500 on database error', async () => {
            // Mock Theme.findOne to throw an error
            Theme.findOne.mockRejectedValue(new Error('broken'));

            // Send a GET request to /api/themes/active
            const res = await request(app).get('/api/themes/active');

            // Verify the response status is 500 Internal Server Error
            expect(res.status).toBe(500);

            // Verify the error message is returned in the body
            expect(res.body).toHaveProperty('error', 'broken');
        });
    });

    describe('POST /api/themes', () => {
        const newThemeData = {
            name: 'My Theme',
            palette: { primary: { main: '#fff' } },
            typography: {},
            components: {}
        };

        it('creates a new theme and returns 201', async () => {
            // Mock Theme constructor to return an object whose save() resolves to the created theme
            const saved = { _id: 'xyz', ...newThemeData, isActive: false };
            Theme.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(saved)
            }));

            // Send a POST request to /api/themes with newThemeData
            const res = await request(app)
                .post('/api/themes')
                .send(newThemeData);

            // Verify Theme was constructed with isActive: false
            expect(Theme).toHaveBeenCalledWith({ ...newThemeData, isActive: false });

            // Verify the response status is 201 Created
            expect(res.status).toBe(201);

            // Verify the response body matches the saved theme
            expect(res.body).toEqual(saved);
        });

        it('returns 400 when save() throws validation error', async () => {
            // Mock Theme constructor to return an object whose save() rejects
            Theme.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error('bad data'))
            }));

            // Send a POST request to /api/themes with empty body
            const res = await request(app)
                .post('/api/themes')
                .send({});

            // Verify the response status is 400 Bad Request
            expect(res.status).toBe(400);

            // Verify the error message is returned in the body
            expect(res.body).toHaveProperty('error', 'bad data');
        });
    });

    describe('PUT /api/themes/:id', () => {
        const themeId = 'abcd';

        it('deactivates other themes and updates the target when isActive=true', async () => {
            // Mock updateMany to succeed
            Theme.updateMany.mockResolvedValue({ nModified: 1 });

            // Mock findByIdAndUpdate to return the updated theme
            const updated = { _id: themeId, isActive: true };
            Theme.findByIdAndUpdate.mockResolvedValue(updated);

            // Send a PUT request to /api/themes/:id with isActive flag
            const res = await request(app)
                .put(`/api/themes/${themeId}`)
                .send({ isActive: true });

            // Verify updateMany was called to deactivate all other themes
            expect(Theme.updateMany).toHaveBeenCalledWith(
                { _id: { $ne: themeId } },
                { $set: { isActive: false } }
            );

            // Verify findByIdAndUpdate was called with the correct ID and body
            expect(Theme.findByIdAndUpdate).toHaveBeenCalledWith(
                themeId,
                { isActive: true },
                { new: true }
            );

            // Verify the response status is 200 OK
            expect(res.status).toBe(200);

            // Verify the response body matches the updated theme
            expect(res.body).toEqual(updated);
        });

        it('skips deactivation when updating other fields', async () => {
            // Mock findByIdAndUpdate to return the updated theme
            const updated = { _id: themeId, name: 'new-name' };
            Theme.findByIdAndUpdate.mockResolvedValue(updated);

            // Send a PUT request to /api/themes/:id with a name change only
            const res = await request(app)
                .put(`/api/themes/${themeId}`)
                .send({ name: 'new-name' });

            // Verify updateMany was not called
            expect(Theme.updateMany).not.toHaveBeenCalled();

            // Verify the response status is 200 OK
            expect(res.status).toBe(200);

            // Verify the response body matches the updated theme
            expect(res.body).toEqual(updated);
        });

        it('returns 404 if the theme to update does not exist', async () => {
            // Mock findByIdAndUpdate to return null
            Theme.findByIdAndUpdate.mockResolvedValue(null);

            // Send a PUT request to /api/themes/:id
            const res = await request(app)
                .put(`/api/themes/${themeId}`)
                .send({ isActive: true });

            // Verify the response status is 404 Not Found
            expect(res.status).toBe(404);

            // Verify the error message is returned in the body
            expect(res.body).toEqual({ error: 'Theme not found' });
        });

        it('returns 400 on invalid update data', async () => {
            // Mock updateMany to be a no-op
            Theme.updateMany.mockResolvedValue({});

            // Mock findByIdAndUpdate to throw an error
            Theme.findByIdAndUpdate.mockRejectedValue(new Error('invalid'));

            // Send a PUT request to /api/themes/:id with invalid field
            const res = await request(app)
                .put(`/api/themes/${themeId}`)
                .send({ typo: 'oops' });

            // Verify the response status is 400 Bad Request
            expect(res.status).toBe(400);

            // Verify the error message is returned in the body
            expect(res.body).toHaveProperty('error', 'invalid');
        });
    });

    describe('DELETE /api/themes/:id', () => {
        const themeId = 'to-delete';

        it('deletes an existing theme', async () => {
            // Mock findByIdAndDelete to return the deleted theme
            const deleted = { _id: themeId };
            Theme.findByIdAndDelete.mockResolvedValue(deleted);

            // Send a DELETE request to /api/themes/:id
            const res = await request(app).delete(`/api/themes/${themeId}`);

            // Verify findByIdAndDelete was called with the correct ID
            expect(Theme.findByIdAndDelete).toHaveBeenCalledWith(themeId);

            // Verify the response status is 200 OK
            expect(res.status).toBe(200);

            // Verify the success message is returned
            expect(res.body).toEqual({ message: 'Theme deleted successfully' });
        });

        it('returns 404 if the theme to delete does not exist', async () => {
            // Mock findByIdAndDelete to return null
            Theme.findByIdAndDelete.mockResolvedValue(null);

            // Send a DELETE request to /api/themes/:id
            const res = await request(app).delete(`/api/themes/${themeId}`);

            // Verify the response status is 404 Not Found
            expect(res.status).toBe(404);

            // Verify the error message is returned in the body
            expect(res.body).toEqual({ error: 'Theme not found' });
        });

        it('returns 500 on server error during deletion', async () => {
            // Mock findByIdAndDelete to throw an error
            Theme.findByIdAndDelete.mockRejectedValue(new Error('fail'));

            // Send a DELETE request to /api/themes/:id
            const res = await request(app).delete(`/api/themes/${themeId}`);

            // Verify the response status is 500 Internal Server Error
            expect(res.status).toBe(500);

            // Verify the error message is returned in the body
            expect(res.body).toHaveProperty('error', 'fail');
        });
    });
});

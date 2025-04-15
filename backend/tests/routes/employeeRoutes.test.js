process.env.ENCRYPTION_KEY = 'test_dummy_encryption_key';

const express = require('express');
const request = require('supertest');
const router = require('../../routes/employeeRoutes');
const User = require('../../models/User');
const Profession = require('../../models/Profession');

// Mock authentication middleware so that it automatically sets req.user
jest.mock('../../middleware/authMiddleware', () => ({
    protect: (req, res, next) => {
        req.user = { id: 'testUser', role: 'admin' };
        next();
    },
    adminOnly: (req, res, next) => next(),
}));

// Mock the User and Profession models
jest.mock('../../models/User');
jest.mock('../../models/Profession');

describe('Employee Routes', () => {
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
        it('should return a list of employees without passwords and with populated professions', async () => {

            // Arrange: Fake employee data using salon-related professions
            const fakeEmployees = [
                {
                    _id: 'emp1',
                    firstName: 'John',
                    lastName: 'Doe',
                    role: 'employee',
                    employeeDetails: { profession: { _id: 'prof1', name: 'Hair Stylist' } }
                },
                {
                    _id: 'emp2',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    role: 'employee',
                    employeeDetails: { profession: { _id: 'prof2', name: 'Nail Technician' } }
                }
            ];

            // Create a fake chainable query: .select() returns 'this', then .populate() resolves the fakeEmployees.
            const fakeQuery = {
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(fakeEmployees)
            };
            User.find.mockReturnValue(fakeQuery);

            // Act: Send GET request to '/'
            const res = await request(app).get('/');

            // Assert:
            expect(User.find).toHaveBeenCalledWith({ role: 'employee' });
            expect(fakeQuery.select).toHaveBeenCalledWith('-password');
            expect(fakeQuery.populate).toHaveBeenCalledWith('employeeDetails.profession');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(fakeEmployees);
        });

        it('should handle errors and return a 500 status code', async () => {
            // Arrange: force the query chain to reject in populate
            const fakeQuery = {
                select: jest.fn().mockReturnThis(),
                populate: jest.fn().mockRejectedValue(new Error('DB error'))
            };
            User.find.mockReturnValue(fakeQuery);

            // Act:
            const res = await request(app).get('/');

            // Assert:
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('message', 'Server error');
        });
    });

    describe('POST /', () => {
        it('should return 400 if required fields are missing', async () => {
            const res = await request(app).post('/').send({
                firstName: 'John'
                // missing lastName and email
            });
            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'First name, last name, and email are required' });
        });

        it('should create a new employee when profession exists', async () => {
            // Arrange: Use John Doe with an existing profession "Hair Stylist"
            const reqBody = {
                firstName: 'John',
                lastName: 'Doe',
                address: { street: '123 Main', city: 'Townsville' },
                phone: '1234567890',
                email: 'john.doe@example.com',
                profession: 'Hair Stylist'
            };

            const fakeProfession = { _id: 'prof1', name: 'Hair Stylist' };
            // Profession already exists:
            Profession.findOne.mockResolvedValue(fakeProfession);

            // Simulate User.create returning the new employee object.
            const fakeEmployee = {
                _id: 'emp1',
                ...reqBody,
                name: `${reqBody.firstName} ${reqBody.lastName}`,
                role: 'employee',
                employeeDetails: { profession: fakeProfession._id }
            };
            User.create.mockResolvedValue(fakeEmployee);

            // Act:
            const res = await request(app).post('/').send(reqBody);

            // Assert:
            expect(Profession.findOne).toHaveBeenCalledWith({ name: reqBody.profession.trim() });
            expect(User.create).toHaveBeenCalledWith({
                firstName: reqBody.firstName,
                lastName: reqBody.lastName,
                name: `${reqBody.firstName} ${reqBody.lastName}`,
                address: reqBody.address,
                phone: reqBody.phone,
                email: reqBody.email,
                role: 'employee',
                employeeDetails: { profession: fakeProfession._id }
            });
            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(fakeEmployee);
        });

        it('should create a new employee when profession does not exist (creating new Profession)', async () => {
            // Arrange: Use Jane Smith with a non-existing profession "Esthetician"
            const reqBody = {
                firstName: 'Jane',
                lastName: 'Smith',
                address: { street: '456 Elm', city: 'Rivercity' },
                phone: '9876543210',
                email: 'jane.smith@example.com',
                profession: 'Esthetician'
            };

            // No existing profession.
            Profession.findOne.mockResolvedValue(null);
            const fakeNewProfession = { _id: 'prof2', name: 'Esthetician' };
            Profession.create.mockResolvedValue(fakeNewProfession);

            const fakeEmployee = {
                _id: 'emp2',
                ...reqBody,
                name: `${reqBody.firstName} ${reqBody.lastName}`,
                role: 'employee',
                employeeDetails: { profession: fakeNewProfession._id }
            };
            User.create.mockResolvedValue(fakeEmployee);

            // Act:
            const res = await request(app).post('/').send(reqBody);

            // Assert:
            expect(Profession.findOne).toHaveBeenCalledWith({ name: reqBody.profession.trim() });
            expect(Profession.create).toHaveBeenCalledWith({ name: reqBody.profession.trim() });
            expect(User.create).toHaveBeenCalledWith({
                firstName: reqBody.firstName,
                lastName: reqBody.lastName,
                name: `${reqBody.firstName} ${reqBody.lastName}`,
                address: reqBody.address,
                phone: reqBody.phone,
                email: reqBody.email,
                role: 'employee',
                employeeDetails: { profession: fakeNewProfession._id }
            });
            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(fakeEmployee);
        });
    });

    describe('PUT /:id', () => {
        it('should update an employee successfully and handle profession change', async () => {
            // Arrange:
            const employeeId = 'emp1';
            const oldProfessionId = 'prof1';
            const newProfessionId = 'prof3';

            // Fake existing employee (John Doe) with a .save() method.
            const fakeEmployee = {
                _id: employeeId,
                firstName: 'John',
                lastName: 'Doe',
                name: 'John Doe',
                address: { street: 'old street' },
                phone: 'old phone',
                email: 'old@example.com',
                role: 'employee',
                employeeDetails: { profession: oldProfessionId },
                save: jest.fn()
            };

            User.findById.mockResolvedValue(fakeEmployee);

            // Update details: change from "Hair Stylist" to "Massage Therapist"
            const updateBody = {
                firstName: 'John',
                lastName: 'Doe',
                address: { street: 'new street' },
                phone: 'new phone',
                email: 'new@example.com',
                profession: 'Massage Therapist'
            };

            // Simulate that no Profession exists and a new one is created.
            const fakeNewProfession = { _id: newProfessionId, name: 'Massage Therapist' };
            Profession.findOne.mockResolvedValue(null);
            Profession.create.mockResolvedValue(fakeNewProfession);

            // Simulate countDocuments returns 0 so the old profession gets deleted.
            User.countDocuments.mockResolvedValue(0);
            Profession.findByIdAndDelete = jest.fn().mockResolvedValue(true);

            const updatedEmployee = {
                _id: employeeId,
                firstName: updateBody.firstName,
                lastName: updateBody.lastName,
                name: `${updateBody.firstName} ${updateBody.lastName}`,
                address: updateBody.address,
                phone: updateBody.phone,
                email: updateBody.email,
                role: 'employee',
                employeeDetails: { profession: newProfessionId }
            };
            fakeEmployee.save.mockResolvedValue(updatedEmployee);

            // Act:
            const res = await request(app)
                .put(`/${employeeId}`)
                .send(updateBody);

            // Assert:
            expect(User.findById).toHaveBeenCalledWith(employeeId);
            expect(Profession.findOne).toHaveBeenCalledWith({ name: updateBody.profession.trim() });
            expect(Profession.create).toHaveBeenCalledWith({ name: updateBody.profession.trim() });
            expect(User.countDocuments).toHaveBeenCalledWith({ 'employeeDetails.profession': oldProfessionId });
            expect(Profession.findByIdAndDelete).toHaveBeenCalledWith(oldProfessionId);
            expect(fakeEmployee.save).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(updatedEmployee);
        });

        it('should update an employee successfully and clear profession if provided empty', async () => {
            // Arrange:
            const employeeId = 'emp2';
            const oldProfessionId = 'prof2';
            // Fake existing employee (Jane Smith) with a .save() method.
            const fakeEmployee = {
                _id: employeeId,
                firstName: 'Jane',
                lastName: 'Smith',
                name: 'Jane Smith',
                address: { street: 'old street' },
                phone: 'old phone',
                email: 'old@example.com',
                role: 'employee',
                employeeDetails: { profession: oldProfessionId },
                save: jest.fn()
            };

            User.findById.mockResolvedValue(fakeEmployee);

            const updateBody = {
                firstName: 'Jane',
                lastName: 'Smith',
                profession: '' // Should clear profession
            };

            // Simulate that countDocuments is not triggering deletion (nonzero count)
            User.countDocuments.mockResolvedValue(1);
            Profession.findByIdAndDelete = jest.fn();

            const updatedEmployee = {
                _id: employeeId,
                firstName: updateBody.firstName,
                lastName: updateBody.lastName,
                name: `${updateBody.firstName} ${updateBody.lastName}`,
                address: fakeEmployee.address,
                phone: fakeEmployee.phone,
                email: fakeEmployee.email,
                role: 'employee',
                employeeDetails: { profession: undefined }
            };
            fakeEmployee.save.mockResolvedValue(updatedEmployee);

            // Act:
            const res = await request(app)
                .put(`/${employeeId}`)
                .send(updateBody);

            // Assert:
            expect(User.findById).toHaveBeenCalledWith(employeeId);
            // No call for Profession.findOne or create since an empty string was provided.
            expect(Profession.findByIdAndDelete).not.toHaveBeenCalled();
            expect(fakeEmployee.save).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(updatedEmployee);
        });

        it('should return a 404 error if the employee is not found', async () => {
            const employeeId = 'nonexistent';
            User.findById.mockResolvedValue(null);

            const res = await request(app)
                .put(`/${employeeId}`)
                .send({ firstName: 'NewName' });

            expect(User.findById).toHaveBeenCalledWith(employeeId);
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'Employee not found' });
        });

        describe('Unauthorized update', () => {
            let unauthorizedApp;
            let unauthorizedRouter;

            beforeAll(() => {
                // Isolate modules so we can re-mock the auth middleware.
                jest.resetModules(); // reset the module registry
                jest.doMock('../../middleware/authMiddleware', () => ({
                    // Overriding the protect middleware for this test block.
                    protect: (req, res, next) => {
                        // Simulate a user that is not admin and whose id differs from req.params.id.
                        req.user = { id: 'differentUser', role: 'employee' };
                        next();
                    },
                    adminOnly: (req, res, next) => next(),
                }));

                // Re-require the router after re-mocking auth.
                unauthorizedRouter = require('../../routes/employeeRoutes');

                // Create a fresh app that uses the unauthorized router.
                unauthorizedApp = require('express')();
                unauthorizedApp.use(require('express').json());
                unauthorizedApp.use('/', unauthorizedRouter);
            });

            it('should return 403 if the user is not authorized to update', async () => {
                // Make a PUT request using an id that does not match the fake req.user.id
                const res = await require('supertest')(unauthorizedApp)
                    .put('/someId')  // "someId" does not equal "differentUser"
                    .send({ firstName: 'New' });

                expect(res.statusCode).toBe(403);
                expect(res.body).toEqual({ message: 'Access Denied: Only admins or owner can update profile' });
            });
        });

        it('should handle errors during update and return a 500 status code', async () => {
            const employeeId = 'emp3';
            const fakeEmployee = {
                _id: employeeId,
                firstName: 'John',
                lastName: 'Doe',
                name: 'John Doe',
                address: { street: 'old street' },
                phone: 'old phone',
                email: 'old@example.com',
                role: 'employee',
                employeeDetails: {},
                save: jest.fn().mockRejectedValue(new Error('Save failed'))
            };
            User.findById.mockResolvedValue(fakeEmployee);

            const res = await request(app)
                .put(`/${employeeId}`)
                .send({ firstName: 'New' });

            expect(User.findById).toHaveBeenCalledWith(employeeId);
            expect(fakeEmployee.save).toHaveBeenCalled();
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Server error' });
        });
    });

    describe('DELETE /:id', () => {
        it('should delete an employee and remove profession if no other employees use it', async () => {
            const employeeId = 'emp1';
            const professionId = 'prof1';
            const fakeEmployee = {
                _id: employeeId,
                firstName: 'John',
                lastName: 'Doe',
                employeeDetails: { profession: professionId },
                remove: jest.fn().mockResolvedValue(true)
            };

            User.findById.mockResolvedValue(fakeEmployee);
            User.countDocuments.mockResolvedValue(0);
            Profession.findByIdAndDelete = jest.fn().mockResolvedValue(true);

            const res = await request(app)
                .delete(`/${employeeId}`)
                .send();

            expect(User.findById).toHaveBeenCalledWith(employeeId);
            expect(fakeEmployee.remove).toHaveBeenCalled();
            expect(User.countDocuments).toHaveBeenCalledWith({ 'employeeDetails.profession': professionId });
            expect(Profession.findByIdAndDelete).toHaveBeenCalledWith(professionId);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Employee removed' });
        });

        it('should delete an employee without deleting profession if others exist', async () => {
            const employeeId = 'emp2';
            const professionId = 'prof2';
            const fakeEmployee = {
                _id: employeeId,
                firstName: 'Jane',
                lastName: 'Smith',
                employeeDetails: { profession: professionId },
                remove: jest.fn().mockResolvedValue(true)
            };

            User.findById.mockResolvedValue(fakeEmployee);
            User.countDocuments.mockResolvedValue(5);
            Profession.findByIdAndDelete = jest.fn();

            const res = await request(app)
                .delete(`/${employeeId}`)
                .send();

            expect(User.findById).toHaveBeenCalledWith(employeeId);
            expect(fakeEmployee.remove).toHaveBeenCalled();
            expect(User.countDocuments).toHaveBeenCalledWith({ 'employeeDetails.profession': professionId });
            expect(Profession.findByIdAndDelete).not.toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Employee removed' });
        });

        it('should return a 404 if the employee to delete is not found', async () => {
            const employeeId = 'nonexistent';
            User.findById.mockResolvedValue(null);

            const res = await request(app)
                .delete(`/${employeeId}`)
                .send();

            expect(User.findById).toHaveBeenCalledWith(employeeId);
            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'Employee not found' });
        });

        it('should handle errors during deletion and return a 500 status code', async () => {
            const employeeId = 'emp3';
            User.findById.mockRejectedValue(new Error('DB error'));

            const res = await request(app)
                .delete(`/${employeeId}`)
                .send();

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Server error' });
        });
    });
});

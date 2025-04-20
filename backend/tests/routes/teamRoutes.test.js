// tests/teamRoutes.test.js

const request = require('supertest');
const express = require('express');
const teamRoutes = require('../routes/teamRoutes'); // adjust path as needed
const Employee = require('../models/Employee');

// Mock Mongoose model
jest.mock('../models/Employee');

const app = express();
app.use('/api/team', teamRoutes);

describe('GET /api/team', () => {
  it('should return formatted team members', async () => {
    const mockEmployees = [
      {
        firstName: 'Jane',
        lastName: 'Doe',
        title: 'Stylist',
        description: 'Loves color',
        imageUrl: '/images/jane.jpg'
      },
      {
        firstName: 'John',
        lastName: 'Smith',
        title: 'Barber',
        description: 'Fade expert',
        imageUrl: '/images/john.jpg'
      }
    ];

    Employee.find.mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockEmployees)
    }));

    const res = await request(app).get('/api/team');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].fullName).toBe('Jane Doe');
    expect(res.body[1].fullName).toBe('John Smith');
  });

  it('should handle errors gracefully', async () => {
    Employee.find.mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockRejectedValue(new Error('Database error'))
    }));

    const res = await request(app).get('/api/team');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error fetching team members');
  });
});

const request = require('supertest');
const express = require('express');
const nodemailer = require('nodemailer');
const emailRoutes = require('../../routes/emailRoutes');
jest.mock('nodemailer'); // Mock nodemailer to avoid sending real emails


const app = express();
app.use(express.json());
app.use('/api/emails', emailRoutes);

describe('Email Routes', () => {
  let sendMailMock;

  beforeAll(() => {
    // Mock the nodemailer transport and sendMail function
    sendMailMock = jest.fn().mockResolvedValue({});
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
  });

  test('POST / sends an email successfully', async () => {
    const emailData = {
      name: 'John',
      surname: 'Doe',
      phone: '123-456-7890',
      email: 'johndoe@example.com',
      message: 'Hello, I am interested in your services.',
    };

    const res = await request(app).post('/api/emails').send(emailData);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Email sent successfully');

    // Verify that sendMail was called with the correct arguments
    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: 'johndoe@example.com',
      subject: 'New Contact Form Submission from John Doe',
      text: `
You have a new contact form submission from your website:

Name: John
Last Name: Doe
Phone: 123-456-7890
Email: johndoe@example.com

Message:
Hello, I am interested in your services.
    `,
    });
  });

  test('POST / returns 500 if email sending fails', async () => {
    // Simulate a failure in sendMail
    sendMailMock.mockRejectedValueOnce(new Error('Failed to send email'));

    const emailData = {
      name: 'Jane',
      surname: 'Smith',
      phone: '987-654-3210',
      email: 'janesmith@example.com',
      message: 'I would like to book an appointment.',
    };

    const res = await request(app).post('/api/emails').send(emailData);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to send email');

    // Verify that sendMail was called
    expect(sendMailMock).toHaveBeenCalled();
  });

  test('POST / returns 500 if required fields are missing', async () => {
    // Simulate nodemailer throwing an error when required fields are missing
    sendMailMock.mockImplementation((mailOptions) => {
      if (!mailOptions.replyTo || !mailOptions.text.includes('Message:')) {
        throw new Error('Missing required fields');
      }
      return Promise.resolve();
    });

    const emailData = {
      name: 'John',
      surname: 'Doe',
      // Missing email and message fields
    };

    const res = await request(app).post('/api/emails').send(emailData);

    expect(res.status).toBe(500); // The route will return 500 because nodemailer throws an error
    expect(res.body.error).toBe('Failed to send email');

    // Verify that sendMail was called
    expect(sendMailMock).toHaveBeenCalled();
  });
});
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, surname, phone, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,      // retreatsalonandspadevelopment@gmail.com
      pass: process.env.EMAIL_PASS       // Gmail app password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email, // So you can click "Reply" in Gmail and it goes to the user
    subject: `New Contact Form Submission from ${name} ${surname}`,
    text: `
You have a new contact form submission from your website:

Name: ${name}
Last Name: ${surname}
Phone: ${phone}
Email: ${email}

Message:
${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
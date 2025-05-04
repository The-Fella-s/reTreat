// backend/routes/employeeRoutes.js
const express = require('express');
const Employee = require('../models/Employee');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const router = express.Router();

const BUCKET_NAME = process.env.AWS_S3_BUCKET   || 'retreatimages';
const AWS_REGION  = process.env.AWS_REGION      || 'us-west-1';
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const upload = multer({ storage: multer.memoryStorage() });

// Image upload
router.post('/upload', upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
    const ext = path.extname(req.file.originalname);
    const key = `employees/${Date.now()}-${uuidv4()}${ext}`;
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));
    const url = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    res.json({ filePath: url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// CRUD
router.get('/', async (req, res) => {
  try { res.json(await Employee.find()); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const emp = new Employee(req.body);
    await emp.save();
    res.status(201).json(emp);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const d = await Employee.findByIdAndDelete(req.params.id);
    if (!d) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;

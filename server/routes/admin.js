const express = require('express');
const { Course, Admin } = require("../db");
const jwt = require('jsonwebtoken');
const { authenticateJwt } = require("../middleware/auth");
require('dotenv').config();
const SECRET = process.env.SECRET

const router = express.Router();

router.get("/me", authenticateJwt, async (req, res) => {
    const admin = await Admin.findOne({ username: req.user.username });
    if (!admin) {
      res.status(403).json({msg: "Admin doesnt exist"})
      return
    }
    res.json({
        username: admin.username
    })
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
      const adminExists = await Admin.findOne({ username });
      if (adminExists) {
        return res.status(403).json({ message: 'Admin already exists' });
      }
      const newAdmin = new Admin({ username, password });
      await newAdmin.save();

      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Admin created successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });
  
  router.post('/courses', authenticateJwt, async (req, res) => {
    try {
      const course = new Course(req.body);
      await course.save();
      res.json({ message: 'Course created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to save the course', error: error.message });
    }
  });
  
  router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
      res.json({ message: 'Course updated successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  });
  
  router.get('/courses', authenticateJwt, async (req, res) => {
    const courses = await Course.find({});
    res.json({ courses });
  });
  
  router.get('/course/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (course) {
      res.json({ course });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  });

  module.exports = router
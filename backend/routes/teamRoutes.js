const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET all active team members for public display
router.get('/', async (req, res) => {
  try {
    const teamMembers = await Employee.find({})
      .sort({ lastName: 1 }) // Sort alphabetically by last name
      .select('firstName lastName title description imageUrl')
      .lean(); // Convert to plain JavaScript objects
      
    // Combine first and last names and transform the data structure
    const formattedTeamMembers = teamMembers.map(member => ({
      ...member,
      fullName: `${member.firstName} ${member.lastName}`,
    }));

    res.json(formattedTeamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ 
      message: 'Error fetching team members',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
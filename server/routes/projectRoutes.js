const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// SAVE or UPDATE a project
router.post('/save', async (req, res) => {
  try {
    const { name, theme, shapes, keyframes, _id } = req.body;
    
    let project;
    if (_id) {
      // Update existing
      project = await Project.findByIdAndUpdate(
        _id, 
        { name, theme, shapes, keyframes, lastModified: Date.now() },
        { new: true }
      );
    } else {
      // Create new
      project = new Project({ name, theme, shapes, keyframes });
      await project.save();
    }
    
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: "Failed to save project", details: err.message });
  }
});

// GET all projects (for the dashboard)
router.get('/all', async (req, res) => {
  try {
    const projects = await Project.find().sort({ lastModified: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Error fetching projects" });
  }
});

module.exports = router;
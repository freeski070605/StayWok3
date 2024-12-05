const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const Content = require('../models/Content');

// Upload a new media file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description, type } = req.body;

    // Save the uploaded file details in your database
    const content = new Content({
      title,
      description,
      mediaUrl: req.file.path, // Cloudinary URL
      type,
      createdBy: req.user.id, // Assume logged-in user ID
    });

    await content.save();

    res.status(201).json({ message: 'Media uploaded successfully', content });
  } catch (err) {
    console.error('Error uploading media:', err.message);
    res.status(500).json({ error: 'Failed to upload media', details: err.message });
  }
});

module.exports = router;

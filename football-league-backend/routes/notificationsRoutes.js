const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();    

router.get('/', protect, async (req, res) => {
    try {    
        const notifications = await Notification.find({ user: req.user._id });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching notifications', details: err.message });
    }       
})

module.exports = router 
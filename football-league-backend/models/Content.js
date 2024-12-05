const mongoose = require('mongoose');


const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    mediaUrl: { type: String, required: true }, // Video or image URL
    type: { type: String, enum: ['highlight', 'announcement'], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Content', contentSchema);
  
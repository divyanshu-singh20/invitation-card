const mongoose = require('mongoose');

const customizationSchema = new mongoose.Schema({
  design: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    required: true
  },
  brideName: {
    type: String,
    required: true,
    trim: true
  },
  groomName: {
    type: String,
    required: true,
    trim: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventTime: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'English'
  },
  fontStyle: {
    type: String,
    default: 'Arial'
  },
  extraNotes: {
    type: String
  },
  sessionId: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customization', customizationSchema);

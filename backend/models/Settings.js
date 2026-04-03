const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'number', 'boolean', 'json'],
    default: 'text'
  },
  description: {
    type: String
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Static method to get setting by key
settingsSchema.statics.getSetting = async function(key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Static method to set setting
settingsSchema.statics.setSetting = async function(key, value, type = 'text', adminId = null) {
  return await this.findOneAndUpdate(
    { key },
    { value, type, updatedBy: adminId },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('Settings', settingsSchema);

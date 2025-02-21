const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  dimensions: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  landmarks: {
    type: String,
  },
  expectedTraffic: {
    type: String,
  },
});

module.exports = mongoose.model('Property', PropertySchema);
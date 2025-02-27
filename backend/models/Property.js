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
  footfall: {
    type: Number,
    required: true,
  },
  footfallType: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    required: true,
  },
  pricing: {
    monthly: {
      type: Number,
      required: true,
    },
    weekly: {
      type: Number,
      default: null,
    },
  },
  availability: {
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  status: {
    type: String,
    enum: ['Available', 'Requested', 'Approved', 'Rejected'],
    default: 'Available',
  },
});

module.exports = mongoose.model('Property', PropertySchema);
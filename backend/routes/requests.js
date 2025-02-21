const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Request = require('../models/Request');
const Property = require('../models/Property');

// Create a Request
router.post('/', auth, async (req, res) => {
  const { property, message } = req.body;

  try {
    const newRequest = new Request({
      property,
      business: req.user.id,
      message,
    });

    const request = await newRequest.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Requests for a Property
router.get('/property/:id', auth, async (req, res) => {
  try {
    const requests = await Request.find({ property: req.params.id }).populate('business', 'name email');
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Requests for a Business
router.get('/business', auth, async (req, res) => {
  try {
    const requests = await Request.find({ business: req.user.id }).populate('property', 'title address');
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
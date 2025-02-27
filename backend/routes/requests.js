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

router.get('/owner/requested-properties', auth, async (req, res) => {
  try {
    // First, find all properties owned by the logged-in user
    const properties = await Property.find({ owner: req.user.id });
    
    // Extract property IDs
    const propertyIds = properties.map(property => property._id);
    
    // Find all requests that reference these properties
    const requests = await Request.find({ 
      property: { $in: propertyIds }
    })
    .populate('property', 'title address')  // Populate property details
    .populate('business', 'name email');    // Populate business details
    
    res.json(requests);
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

router.get("/business", auth, async (req, res) => {
  try {
    // Fetch requests where the business field matches the authenticated user's ID
    const requests = await Request.find({ business: req.user.id })
      .populate("property", "title address") // Populate only title and address from Property
      .select("-__v") // Exclude version key if you don’t need it
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update Request Status
router.put('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }
    
    // Optional: Add check to ensure only property owner can update status
    const property = await Property.findById(request.property);
    if (property.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    request.status = req.body.status;
    await request.save();
    
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
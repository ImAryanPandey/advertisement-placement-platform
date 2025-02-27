const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Property = require('../models/Property');
const { upload } = require('../utils/fileUpload');
const { check, validationResult } = require('express-validator'); // Add this line

// Add a Property
router.post(
  '/',
  auth,
  upload.array('images', 5),
  [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('dimensions', 'Dimensions are required').notEmpty(),
    check('address', 'Address is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dimensions, address, landmarks, expectedTraffic } = req.body;
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: 'No images uploaded' });
      }

      const imagePaths = req.files.map(file => file.path); // Extract image paths
      const newProperty = new Property({
        owner: req.user.id,
        title,
        description,
        images: imagePaths, // Save image paths
        dimensions,
        address,
        landmarks,
        expectedTraffic,
      });
      const property = await newProperty.save();
      res.json(property);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Get All Properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.json(properties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Single Property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
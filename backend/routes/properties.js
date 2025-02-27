const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Property = require('../models/Property');
const { upload } = require('../utils/fileUpload');
const { check, validationResult } = require('express-validator');

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
    check('pricing.monthly', 'Monthly pricing is required').notEmpty().isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dimensions, address, landmarks, expectedTraffic, footfall, footfallType, pricing, availability } = req.body;
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: 'No images uploaded' });
      }

      const imagePaths = req.files.map(file => file.path); // Extract image paths
      const newProperty = new Property({
        owner: req.user.id,
        title,
        description,
        images: imagePaths,
        dimensions,
        address,
        landmarks,
        expectedTraffic,
        footfall,
        footfallType,
        pricing,
        availability,
        status: 'Available', // Default status
      });

      const property = await newProperty.save();
      res.json(property);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Get All Properties with Filters
router.get('/', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, footfall, footfallType, dimensions, availability } = req.query;

    let query = {};

    if (location) {
      query.address = { $regex: location, $options: 'i' };
    }

    if (minPrice && maxPrice) {
      query['pricing.monthly'] = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    } else if (minPrice) {
      query['pricing.monthly'] = { $gte: parseInt(minPrice) };
    } else if (maxPrice) {
      query['pricing.monthly'] = { $lte: parseInt(maxPrice) };
    }

    if (footfall) {
      query.footfall = { $gte: parseInt(footfall) };
    }

    if (footfallType) {
      query.footfallType = footfallType;
    }

    if (dimensions) {
      query.dimensions = { $regex: dimensions, $options: 'i' };
    }

    if (availability) {
      query.status = availability;
    }

    const properties = await Property.find(query).populate('owner', 'name email');
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
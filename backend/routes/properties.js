const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Property = require('../models/Property');
const { upload } = require('../utils/fileUpload');

// Add a Property
router.post('/', auth,  upload.array('images', 5), async (req, res) => {
  const { title, description, images, dimensions, address, landmarks, expectedTraffic } = req.body;

  try {
    const newProperty = new Property({
      owner: req.user.id,
      title,
      description,
      images,
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
});

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
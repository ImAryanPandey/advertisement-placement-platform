const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectToMongo = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Property = require('./models/Property');
const Request = require('./models/Request');
const propertyRoutes = require('./routes/properties');
const requestRoutes = require('./routes/requests');
const userRoutes = require('./routes/users');
const { upload } = require('./utils/fileUpload');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToMongo();

// Middleware to extract user from token
const auth = require('./middleware/auth');

// Register Route
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({
      name,
      email,
      password,
      role,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err); // Log JWT error
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt:', { email }); // Log login attempt
    let user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', { email }); // Log user not found
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Log password match result
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err); // Log JWT error
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message); // Log server error
    res.status(500).send('Server Error');
  }
});

// Auth Route
app.get('/api/auth', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Property Routes
app.use('/api/properties', propertyRoutes);

// Request Routes
app.use('/api/requests', requestRoutes);

// User Routes
app.use('/api/users', userRoutes);

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Welcome to the Advertisement Placement Platform Backend');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
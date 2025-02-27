const multer = require('multer');
<<<<<<< HEAD
const path = require('path');

// Create uploads directory if it doesn't exist
const fs = require('fs');
const dir = './uploads';
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
=======
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads'); // Ensure correct path

// Check if 'uploads' folder exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create folder recursively
>>>>>>> 59104cf32e35f426bf3a4427e004f33cf7b5a12f
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
<<<<<<< HEAD
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
=======
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
>>>>>>> 59104cf32e35f426bf3a4427e004f33cf7b5a12f
  }
});

const upload = multer({ storage });

module.exports = { upload };

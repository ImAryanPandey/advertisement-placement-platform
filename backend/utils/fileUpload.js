const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination folder for storing uploaded files
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Set the filename as the current timestamp to avoid naming conflicts
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = { upload };
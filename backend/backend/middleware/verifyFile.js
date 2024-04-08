const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../pictures');
  },
  filename: (req, file, cb) => {
    cb(null, 'undefined' + path.extname(file.originalname));
  }
});

// Create the multer instance
const verifyFile = multer({ storage: storage });

module.exports = verifyFile;
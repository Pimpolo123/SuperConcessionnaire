const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../pictures/car');
  },
  filename: (req, file, cb) => {
    cb(null, 'undefined' + path.extname(file.originalname));
  }
});

const verifyCarPics = multer({ storage: storage });

module.exports = verifyCarPics;
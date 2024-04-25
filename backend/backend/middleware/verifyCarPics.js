const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage()

const verifyCarPics = multer({ storage: storage });

module.exports = verifyCarPics;
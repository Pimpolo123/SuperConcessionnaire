const db = require("../models");
const Car = db.car;

const Op = db.Sequelize.Op;

exports.getAllCars = (req, res) => {
};

exports.getCar = (req, res) => {
    const carId = req.params.id;
};

function base64_encode(fileUsername) {
	const files = fs.readdirSync('../pictures');
	for (const file of files) {
        if (file.split('.')[0] == fileUsername) {
            var bitmap = fs.readFileSync('../pictures/' + file);
    		return Buffer.from(bitmap).toString('base64');
        }
    }
	return '';
}
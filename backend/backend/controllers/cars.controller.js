const db = require("../models");
const Car = db.car;

const Op = db.Sequelize.Op;

exports.getAllCars = (req, res) => {
    let carPromises = [];
    let carPromise;
    Car.findAll().then(cars => {
        cars.forEach(car => {
            let optionNames = [];
            carPromise = Promise.all([
                car.getMake(),
                car.getModel(),
                car.getCategory(),
                car.getColor(),
                car.getDrivetrain(),
                car.getEuro(),
                car.getFueltype(),
                car.getGearboxtype(),
                car.getAdmissiontype(),
                car.getOptions().then(opts => {
                    opts.forEach(opt => {
                        optionNames.push(opt.name);
                    })
                    return optionNames
                })
            ]).then(([make, model, category, color, drivetrain, euro, fueltype, gearboxtype, admissiontype, options]) => {
                return { //sort du then
                    power: car.power,
                    year: car.year,
                    price: car.price,
		            description: car.description,
                    firstReg: car.firstReg,
                    displacement: car.displacement,
                    gears: car.gears,
                    cylinders: car.cylinders,
                    doors: car.doors,
                    co2: car.co2,
                    urbanCons: car.urbanCons,
                    mixCons: car.mixCons,
                    hwCons: car.hwCons,
                    make: make.name,
                    model: model.name,
                    category: category.name,
                    color: color.name,
                    drivetrain: drivetrain.name,
                    euro: euro.name,
                    fueltype: fueltype.name,
                    gearboxtype: gearboxtype.name,
                    admissiontype: admissiontype.name,
                    options: options
                };
            });
            carPromises.push(carPromise)
        });
        Promise.all(carPromises).then(carList => {
            res.status(200).send(carList);
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
};

exports.getCar = (req, res) => {
    const carId = req.query.id;
    if(!carId){
        res.status(400).send({
            message: 'Aucune ID'
        })
    }
    Car.findOne({
        where: {
            id: carId
        }
    }).then(car => {
        if(!car){
            res.status(400).send({
                message: 'Voiture introuvable'
            })
        }
        let optionNames = [];
        Promise.all([
            car.getMake(),
            car.getModel(),
            car.getCategory(),
            car.getColor(),
            car.getDrivetrain(),
            car.getEuro(),
            car.getFueltype(),
            car.getGearboxtype(),
            car.getAdmissiontype(),
            car.getOptions().then(opts => {
                opts.forEach(opt => {
                    optionNames.push(opt.name);
                })
                return optionNames
            })
        ]).then(([make, model, category, color, drivetrain, euro, fueltype, gearboxtype, admissiontype, options]) => {
            res.status(200).send({
                power: car.power,
                year: car.year,
                price: car.price,
		        description: car.description,
                firstReg: car.firstReg,
                displacement: car.displacement,
                gears: car.gears,
                cylinders: car.cylinders,
                doors: car.doors,
                co2: car.co2,
                urbanCons: car.urbanCons,
                mixCons: car.mixCons,
                hwCons: car.hwCons,
                make: make.name,
                model: model.name,
                category: category.name,
                color: color.name,
                drivetrain: drivetrain.name,
                euro: euro.name,
                fueltype: fueltype.name,
                gearboxtype: gearboxtype.name,
                admissiontype: admissiontype.name,
                options: options
            })
        })
    }).catch(err => {
		res.status(500).send({ message: err.message });
	});
};

exports.addCar = (req, res) => {
};

function base64_encode(fileUsername) {
	const files = fs.readdirSync('../pictures/car');
	for (const file of files) {
        if (file.split('.')[0] == fileUsername) {
            var bitmap = fs.readFileSync('../pictures/car/' + file);
    		return Buffer.from(bitmap).toString('base64');
        }
    }
	return '';
}
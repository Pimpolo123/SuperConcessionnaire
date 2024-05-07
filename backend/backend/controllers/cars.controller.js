const { where } = require("sequelize");
const db = require("../models");
const Car = db.car;
const AdmissionType = db.admissiontype;
const Category = db.category;
const Color = db.color;
const Drivetrain = db.drivetrain;
const FuelType = db.fueltype;
const GearboxType = db.gearboxtype;
const Make = db.make;
const Model = db.model;
const Euro = db.euro;
const Option = db.option;
const CarPicture = db.carpicture;

const Op = db.Sequelize.Op;

exports.getAllCars = (req, res) => {
    Car.findAll({
        include : [Make, Model, AdmissionType, FuelType, GearboxType, Category, Color, Drivetrain, Euro, Option, {model: CarPicture, limit: 1}]
    }).then(cars => {
        res.status(200).send(cars);
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
        },
        include : [Make, Model, AdmissionType, FuelType, GearboxType, Category, Color, Drivetrain, Euro, Option, CarPicture]
    }).then(car => {
        if(!car){
            res.status(400).send({
                message: 'Voiture introuvable'
            })
        }
        res.status(200).send(car);
    }).catch(err => {
		res.status(500).send({ message: err.message });
	});
};

exports.addCar = (req, res) => {
    base64Ids = [];
    let filePromises = [];
    req.files.forEach(file => {
        const filePromise = CarPicture.create({
            base64url: file.buffer.toString('base64')
        }).then(pic => {
            base64Ids.push(pic.id)
        })
        filePromises.push(filePromise);
    })
    Promise.all(filePromises)
        .then(() => {
            return Car.create({
                power: req.body.power,
                year: req.body.year,
                price: req.body.price,
                kilometers: req.body.kilometers,
                description: req.body.description,
                firstReg: req.body.firstReg,
                displacement: req.body.displacement,
                gears: req.body.gears,
                cylinders: req.body.cylinders,
                doors: req.body.doors,
                co2: req.body.co2,
                urbanCons: req.body.urbanCons,
                mixCons: req.body.mixCons,
                hwCons: req.body.hwCons
        })
	}).then(car => {
        return Promise.all([
            car.setMake(req.body.makeId),
            car.setModel(req.body.modelId),
            car.setCategory(req.body.categoryId),
            car.setAdmissiontype(req.body.admissiontypeId),
            car.setColor(req.body.colorId),
            car.setDrivetrain(req.body.drivetrainId),
            car.setGearboxtype(req.body.gearboxtypeId),
            car.setFueltype(req.body.fueltypeId),
            car.setEuro(req.body.euroId),
            car.setOptions(JSON.parse(req.body.options)),
            car.setCarpictures(base64Ids),
        ])
	}).then(() => {
        return res.status(200).send({message: "Voiture créée"});
	}).catch(error => {
        return res.status(500).send({ message: error.message});
    });
};

exports.editCar = (req, res) => {
    base64Ids = [];
    let filePromises = [];
    let oldPictures = [];
    req.files.forEach(file => {
        const filePromise = CarPicture.create({
            base64url: file.buffer.toString('base64')
        }).then(pic => {
            base64Ids.push(pic.id)
        })
        filePromises.push(filePromise);
    })
    Promise.all(filePromises).then(() => {
        return Car.findOne({
            where: {
                id: req.body.id
            },
            include: CarPicture
        })
	}).then(car => {
        if(!car){
            return res.status(500).send({ message: "Erreur : Voiture introuvable" });
        }
        oldPictures = car.carpictures;

        car.power = req.body.power;
        car.year = req.body.year;
        car.price = req.body.price;
        car.kilometers = req.body.kilometers;
        car.description = req.body.description;
        car.firstReg = req.body.firstReg;
        car.displacement = req.body.displacement;
        car.gears = req.body.gears;
        car.cylinders = req.body.cylinders;
        car.doors = req.body.doors;
        car.co2 = req.body.co2;
        car.urbanCons = req.body.urbanCons;
        car.mixCons = req.body.mixCons;
        car.hwCons = req.body.hwCons;
        return Promise.all([
            car.setMake(req.body.makeId),
            car.setModel(req.body.modelId),
            car.setCategory(req.body.categoryId),
            car.setAdmissiontype(req.body.admissiontypeId),
            car.setColor(req.body.colorId),
            car.setDrivetrain(req.body.drivetrainId),
            car.setGearboxtype(req.body.gearboxtypeId),
            car.setFueltype(req.body.fueltypeId),
            car.setEuro(req.body.euroId),
            car.setOptions(JSON.parse(req.body.options)),
            car.setCarpictures(base64Ids),
            car.save()
        ])
	}).then(() => {
        return Promise.all(oldPictures.map(picture => picture.destroy()));
	}).then(() => {
        res.status(200).send({message: "Voiture modifiée"});
	}).catch(error => {
        res.status(500).send({ message: error.message});
    });
}

exports.deleteCar = (req, res) => {
	Car.destroy({
		where: {
			id: req.query.id
		}
	})
	res.status(200).send({message: "Voiture supprimée"});
};

exports.deleteCars = (req, res) => {
    const cars = req.body.cars;
    cars.forEach(car => {
        Car.destroy({
            where: {
                id: car.id
            }
        })
    })
	res.status(200).send({message: "Voitures supprimées"});
};

exports.getAllMakes = (req, res) => {
    Make.findAll().then(makes => {
        res.status(200).send(makes);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getModels = (req, res) => {
    Model.findAll({
        where: {
            makeId: req.query.makeId
        }
    }).then(models => {
        res.status(200).send(models);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getAllCategories = (req, res) => {
    Category.findAll().then(categories => {
        res.status(200).send(categories);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getAllAdmissionTypes = (req, res) => {
    AdmissionType.findAll().then(admissionTypes => {
        res.status(200).send(admissionTypes);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getAllColors = (req, res) => {
    Color.findAll().then(colors => {
        res.status(200).send(colors);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getAllDrivetrains = (req, res) => {
    Drivetrain.findAll().then(drivetrains => {
        res.status(200).send(drivetrains);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getAllFuelTypes = (req, res) => {
    FuelType.findAll().then(fuelTypes => {
        res.status(200).send(fuelTypes);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getAllGearboxTypes = (req, res) => {
    GearboxType.findAll().then(gearboxTypes => {
        res.status(200).send(gearboxTypes);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getAllEuros = (req, res) => {   
    Euro.findAll().then(euros => {
        res.status(200).send(euros);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getAllOptions = (req, res) => {
    Option.findAll().then(options => {
        res.status(200).send(options);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

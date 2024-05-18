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
        return res.status(400).send({
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
            return res.status(400).send({
                message: 'Voiture introuvable'
            })
        }
        res.status(200).send(car);
    }).catch(err => {
		res.status(500).send({ message: err.message });
	});
};

exports.addCar = (req, res) => {
    newCar = JSON.parse(req.body.car);
    console.log(newCar);
    base64Ids = [];
    optionIds = [];
    let filePromises = [];
    req.files.forEach(file => {
        const filePromise = CarPicture.create({
            base64url: file.buffer.toString('base64')
        }).then(pic => {
            base64Ids.push(pic.id)
        })
        filePromises.push(filePromise);
    });
    newCar.options.forEach(option => {
        optionIds.push(option.id);
    });
    Promise.all(filePromises)
        .then(() => {
            return Car.create({
                power: newCar.power,
                year: newCar.year,
                price: newCar.price,
                kilometers: newCar.kilometers,
                description: newCar.description,
                firstReg: newCar.firstReg,
                displacement: newCar.displacement,
                gears: newCar.gears,
                cylinders: newCar.cylinders,
                doors: newCar.doors,
                co2: newCar.co2,
                urbanCons: newCar.urbanCons,
                mixCons: newCar.mixCons,
                hwCons: newCar.hwCons
        })
	}).then(car => {
        return Promise.all([
            car.setMake(newCar.make.id),
            car.setModel(newCar.model.id),
            car.setCategory(newCar.category?.id),
            car.setAdmissiontype(newCar.admissiontype?.id),
            car.setColor(newCar.color?.id),
            car.setDrivetrain(newCar.drivetrain?.id),
            car.setGearboxtype(newCar.gearboxtype?.id),
            car.setFueltype(newCar.fueltype?.id),
            car.setEuro(newCar.euro?.id),
            car.setOptions(optionIds),
            car.setCarpictures(base64Ids),
        ])
	}).then(data => {
        return res.status(200).send({message: "Voiture créée", id: data[0].dataValues.id});
	}).catch(error => {
        console.log(error);
        return res.status(500).send({ message: error.message});
    });
};

exports.editCar = (req, res) => {
    let editedCar;
    try {
        editedCar = JSON.parse(req.body.car);
    } catch (error) {
        return res.status(400).send({ message: "Invalid JSON input" });
    }
    console.log("EDIT CAR", editedCar);
    const base64Ids = [];
    const filePromises = [];
    optionIds = [];
    let oldPictures = [];

    editedCar.carpictures.forEach(pic => {
        base64Ids.push(pic.id);
    });
    editedCar.options.forEach(option => {
        optionIds.push(option.id);
    });

    if (Array.isArray(req.files) && req.files.length > 0) {
        req.files.forEach(file => {
            const filePromise = CarPicture.create({
                base64url: file.buffer.toString('base64')
            }).then(pic => {
                base64Ids.push(pic.id);
            }).catch(error => {
                console.error("Error creating CarPicture:", error);
                throw error;
            });
            filePromises.push(filePromise);
        });
    }

    Promise.all(filePromises).then(() => {
        return Car.findOne({
            where: { id: editedCar.id },
            include: CarPicture
        });
    }).then(car => {
        if (!car) {
            return res.status(404).send({ message: "Erreur : Voiture introuvable" });
        }

        car.carpictures.forEach(pic => {
            if (!base64Ids.includes(pic.id)) {
                oldPictures.push(pic);
            }
        });

        car.id = editedCar.id;
        car.power = editedCar.power;
        car.year = editedCar.year;
        car.price = editedCar.price;
        car.kilometers = editedCar.kilometers;
        car.description = editedCar.description;
        car.firstReg = editedCar.firstReg;
        car.displacement = editedCar.displacement;
        car.gears = editedCar.gears;
        car.cylinders = editedCar.cylinders;
        car.doors = editedCar.doors;
        car.co2 = editedCar.co2;
        car.urbanCons = editedCar.urbanCons;
        car.mixCons = editedCar.mixCons;
        car.hwCons = editedCar.hwCons;

        return Promise.all([
            car.setMake(editedCar.make.id),
            car.setModel(editedCar.model.id),
            car.setCategory(editedCar.category?.id),
            car.setAdmissiontype(editedCar.admissiontype?.id),
            car.setColor(editedCar.color?.id),
            car.setDrivetrain(editedCar.drivetrain?.id),
            car.setGearboxtype(editedCar.gearboxtype?.id),
            car.setFueltype(editedCar.fueltype?.id),
            car.setEuro(editedCar.euro?.id),
            car.setOptions(optionIds),
            car.setCarpictures(base64Ids),
            car.save()
        ]);
    }).then(() => {
        if (oldPictures.length > 0) {
            return Promise.all(oldPictures.map(picture => picture.destroy()));
        }
    }).then(() => {
        res.status(200).send({ message: "Voiture modifiée" });
    }).catch(error => {
        console.error("Error in editCar:", error);
        res.status(500).send({ message: error.message });
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

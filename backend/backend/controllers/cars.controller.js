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
        include : [Make, Model, AdmissionType, FuelType, GearboxType, Category, Color, Drivetrain, Euro, Option, CarPicture]
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
    if(!req.files) {
        res.status(500).send({ message: "Erreur : Fichier manquant" });
    }
    req.files.forEach(file => {
        if(file.size > 5000000){
            res.status(500).send({ message: "Erreur : Fichier trop gros" });
        }
        if(file.mimetype.split('/')[0] != 'image'){
            res.status(500).send({ message: "Erreur : Type non autorisé" });
        }
        if(req.body.description.length() > 2000){
            res.status(500).send({ message: "Erreur : Description trop longue" });
        }
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
        res.status(200).send({message: "Voiture créée"});
	}).catch(error => {
        res.status(500).send({ message: error.message});
    });
};
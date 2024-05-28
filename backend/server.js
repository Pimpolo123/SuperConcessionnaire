const express = require('express')
require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT_BACK = process.env.PORT_BACK || 8080;
const PORT_FRONT = process.env.PORT_FRONT;
const HOST = process.env.SERVER_HOST;
const fs = require('fs');
const path = require('path');
const pictureDir = '../pictures/user'

const db = require("./backend/models");
const Role = db.role;
const Country = db.country;
const Region = db.region;
const Address = db.address;
const User = db.user;
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
var bcrypt = require("bcryptjs");

var corsOptions = {
    origin: `http://${HOST}:${PORT_FRONT}`
  };  


fs.readdir(pictureDir, (err, files) => {
	if (err) throw err;

	for (const file of files) {
		fs.unlink(path.join(pictureDir, file), (err) => {
			if (err) throw err;
		});
	}
});

app.use(cors(corsOptions));

app.use(express.json({limit: '200mb'}));

app.use(express.urlencoded({ extended: true, limit: '200mb' }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome" });
});

require('./backend/routes/auth.routes')(app);
require('./backend/routes/users.routes')(app);
require('./backend/routes/admin.routes')(app);
require('./backend/routes/cars.routes')(app);
require('./backend/routes/bid.routes')(app);
require('./backend/routes/pdf.routes')(app);

app.listen(PORT_BACK, () => {
    console.log(`Serveur en ligne sur le port ${PORT_BACK}.`);
});

// SEULEMENT EN DEV !!! 
// PROD : 
// db.sequelize.sync();
// et créer tout manuellement
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial();
});

function initial() {
	let makes = require('./static/makes_list.json');
	let models = require('./static/models_list.json');
	let gearboxTypes = require('./static/gearboxtypes_list.json');
	let fuelTypes = require('./static/fueltypes_list.json');
	let categories = require('./static/categories_list.json');
	let drivetrains = require('./static/drivetrains_list.json');
	let colors = require('./static/colors_list.json');
	let admissionTypes = require('./static/admissiontypes_list.json');
	let euro = require('./static/euro_list.json');
	let options = require('./static/options_list.json');
	let countries = require('country-region-data/data.json');
	let pictures = require('./static/pictures_list.json');
	countries = countries.slice(0, 10); 
	models = models.slice(0, 20);

    Role.create({
		id: 1,
		name: "user"
    });
   
    Role.create({
      	id: 2,
      	name: "moderator"
    });
   
    Role.create({
		id: 3,
		name: "admin"
    });

	User.create({
		username:"jf",
		email: "jf@jf.com",
		password: bcrypt.hashSync("toto", 8),
		name: "toto",
		surname: "toto",
		birthdate: "2000-12-31",
		phonenumber: "0476091162"
	}).then(user => {
        user.setRoles([3])
    });

	User.create({
		username:"jf2",
		email: "jf2@jf.com",
		password: bcrypt.hashSync("toto", 8),
		name: "tata",
		surname: "tata",
		birthdate: "2000-12-31",
		phonenumber: "0476091162"
	}).then(user => {
        user.setRoles([1, 2])
    });

	User.create({
		username:"jf3",
		email: "jf3@jf.com",
		password: bcrypt.hashSync("toto", 8),
		name: "titi",
		surname: "titi",
	}).then(user => {
        user.setRoles([1])
    });

	console.log("Roles créés");

	for (const key in countries) {
		if (Object.hasOwnProperty.call(countries, key)) {
			let c = countries[key];
			Country.create({
				countryName: c.countryName,
				countryShortCode: c.countryShortCode
			}).then(country => {
				for (const key in c.regions) {
					if (Object.hasOwnProperty.call(c.regions, key)) {
						const r = c.regions[key];
						Region.create({
							regionName: r.name,
							regionShortCode: r.shortCode
						}).then(region => {
							region.setCountry([country.id]);
						});
					};
				};
			});
		};
	};

	makes.forEach(name => {
		Make.findOrCreate({
			where: { name: name }, 
			defaults: { name: name } 
		})
	});
	models.forEach(m => {
		Model.findOrCreate({
			where: { name: m.model },
			defaults: { name: m.model }
		}).then(model => {
			Make.findOrCreate({
				where: { name: m.make }, 
				defaults: { name: m.make } 
			}).then(make => {
				model[0].setMake(make[0].id);
				model[0].save();
			})
		});
	});
	gearboxTypes.forEach(name => {
		GearboxType.findOrCreate({
			where: { name: name },
			defaults: { name: name }
		});
	});
	fuelTypes.forEach(name => {
		FuelType.findOrCreate({
			where: { name: name },
			defaults: { name: name }
		});
	});
	categories.forEach(name => {
		Category.findOrCreate({
			where: { name: name },
			defaults: { name: name }
		});
	});
	drivetrains.forEach(name => {
		Drivetrain.findOrCreate({
			where: { name: name },
			defaults: { name: name }
		});
	});
	colors.forEach(name => {
		Color.findOrCreate({
			where: { name: name },
			defaults: { name: name }
		});
	});
	admissionTypes.forEach(name => {
		AdmissionType.findOrCreate({
			where: { name: name },
			defaults: { name: name }
		});
	});
	euro.forEach(name => {
		Euro.findOrCreate({
			where: { name: name },
			defaults: { name: name }
		});
	});
	options.forEach(name => {
		Option.findOrCreate({
			where: { name: name },
			defaults: { name: name }
		});
	});

	[pictures[0], pictures[0], pictures[0]].forEach(e => {
		CarPicture.create({
			base64url: e
		})
	})

	Car.create({
		power: 200,
		year: 2018,
		price: 20000,
		kilometers: 200000,
		description: "T'as vu l'auto mon copain ?",
		firstReg: "2018-07-01",
		displacement: 1499,
		gears: 6,
		cylinders: 3,
		doors: 3,
		co2: 237,
		urbanCons: 9.5,
		mixCons: 7.2,
		hwCons: 5
	}).then(car => {
		car.setMake(35);
		car.setModel(1);
		car.setCategory(1);
		car.setAdmissiontype(1);
		car.setColor(1);
		car.setDrivetrain(1);
		car.setGearboxtype(1);
		car.setFueltype(1);
		car.setEuro(1);
		car.setOptions([1, 10, 20]);
		car.setCarpictures([1,2]);
	})

	Car.create({
		power: 70,
		year: 1998,
		price: 15000,
		kilometers: 201000,
		description: "Jolie voiture mon copain",
		firstReg: "1998-07-01",
		displacement: 3000,
		gears: 4,
		cylinders: 6,
		doors: 5,
		co2: 237,
		urbanCons: 9.5,
		mixCons: 7.2,
		hwCons: 5
	}).then(car => {
		car.setMake(2);
		car.setModel(2);
		car.setCategory(2);
		car.setAdmissiontype(2);
		car.setColor(2);
		car.setDrivetrain(2);
		car.setGearboxtype(2);
		car.setFueltype(2);
		car.setEuro(2);
		car.setOptions([2, 11, 21]);
		car.setCarpictures([3]);
	})
}
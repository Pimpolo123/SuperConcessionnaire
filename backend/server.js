const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT_BACK = process.env.PORT_BACK || 8080;
const PORT_FRONT = process.env.PORT_FRONT;
const HOST = process.env.SERVER_HOST;
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
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
const Message = db.message;
const PDFinfos = db.pdfinfos;
const DealerInformations = db.dealerinformations;
const NewsletterInfos = db.newsletterinfos;
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");

var corsOptions = {
    origin: `http://${HOST}:${PORT_FRONT}`
  };  


// fs.readdir(pictureDir, (err, files) => {
// 	if (err) throw err;

// 	for (const file of files) {
// 		fs.unlink(path.join(pictureDir, file), (err) => {
// 			if (err) throw err;
// 		});
// 	}
// });

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
require('./backend/routes/mailing.routes')(app);
require('./backend/routes/appointment.routes')(app);

const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: `http://${HOST}:${PORT_FRONT}`,
		methods: ['GET', 'POST']
	}
});

let connectedClients = 0;
let connectedAdmins = 0;

// Gestion des connexions et déconnexions
io.on('connection', (socket) => {

    socket.on('authenticated', (userData) => {
		if(connectedAdmins > 0){
			console.log('Un admin est connecté');
			socket.emit('openChat');
		}
		if(userData.roles.includes('ROLE_ADMIN') || userData.roles.includes('ROLE_MODERATOR')) {
			connectedAdmins++;
		}
		connectedClients++;
		socket.emit('connected clients', connectedClients);
    });

    socket.on('logout', (userData) => {
		if((userData.roles.includes('ROLE_ADMIN') || userData.roles.includes('ROLE_MODERATOR')) && connectedAdmins > 0) {
			connectedAdmins--;
		}
		if(connectedClients > 0){
			connectedClients--;
		}
		console.log(connectedClients);
    });

	socket.on('disconnected', (userData) => {
		if(userData.roles.includes('ROLE_ADMIN') || userData.roles.includes('ROLE_MODERATOR')) {
			connectedAdmins--;
		}
		if(connectedClients > 0){
			connectedClients--;
		}
		console.log(connectedClients);
    });

	socket.on('get connected clients', () => {
		socket.emit('connected clients', connectedClients);
	});
	socket.on('join room', (roomId) => {
        socket.join(roomId);
        console.log(`L'utilisateur a rejoint la room: ${roomId}`);
    });

	socket.on('leave room', (roomId) => {
        socket.leave(roomId);
        console.log(`L'utilisateur a quitté la room: ${roomId}`);
    });

    socket.on('chat message', (data) => {
        const { user, text, roomId } = data;

        // Émettre le message uniquement dans la room spécifiée
        io.to(roomId).emit('chat message', {
            user: user,
            text: text
        });
    });

	socket.on('get rooms', () => {
        const rooms = Array.from(io.sockets.adapter.rooms.keys());

        // Filtrer les rooms pour exclure les rooms individuelles (qui ont le même ID que le socket)
        const filteredRooms = rooms.filter(room => !io.sockets.sockets.get(room));

        socket.emit('rooms list', filteredRooms);
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur est déconnecté');
    });
});


server.listen(PORT_BACK, () => {
    console.log(`Serveur en ligne sur le port ${PORT_BACK}.`);
});

process.on('SIGINT', function () { 
	schedule.gracefulShutdown()
	.then(() => process.exit(0))
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
	//VERSION TEST
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
	// countries = countries.slice(0, 10); 
	// models = models.slice(0, 20);

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
		username:"admin",
		email: "admin@admin.com",
		password: bcrypt.hashSync("toto", 8),
		name: "JF",
		surname: "Mathonet",
		birthdate: "2000-12-31",
		phonenumber: "0476091162"
	}).then(user => {
        user.setRoles([3])
    });

	User.create({
		username:"harold1",
		email: "tartix69@gmail.com",
		password: bcrypt.hashSync("toto", 8),
		name: "Dupont",
		surname: "Harold",
		birthdate: "2000-12-31",
		phonenumber: "0476091162",
		emailoptin: true,
		emailCarSold: true,
	}).then(user => {
        user.setRoles([1, 2])
    });

	User.create({
		username:"panoramix",
		email: "jefjef2222@gmail.com",
		password: bcrypt.hashSync("toto", 8),
		name: "Mathonet",
		surname: "JF",
		birthdate: "2000-12-31",
		phonenumber: "0476091162",
		emailoptin: true,
		emailCarSold: true,
	}).then(user => {
        user.setRoles([1, 2])
    });

	User.create({
		username:"jc1960",
		email: "johnnyc@caramail.com",
		password: bcrypt.hashSync("toto", 8),
		name: "Cadillac",
		surname: "Johnny",
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
		hwCons: 5,
		new: false
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
	PDFinfos.create({
		fileName: "test.pdf",
		dealershipName: "SuperConcessionnaire2000",
		promiseDate: "1998-07-01",
		promiseLocation: "Mons",
		deposit: 500,
		bankAccount: "BE81 0000 0000 0000"
	}).then(pdfinfos => {
		pdfinfos.setUser(1);
		pdfinfos.setCar(1);
		pdfinfos.save();
	});
	DealerInformations.create({
		dealershipName: "SuperConcessionnaire2000",
		bankAccount: "BE00000000000000",
		country: "Belgique",
		region: "Wallonie",
		city: "Mons",
		postcode: "7000",
		street: "Rue de la gare",
		number: "12",
		phoneNumber: "0476091162"
	});
	
}
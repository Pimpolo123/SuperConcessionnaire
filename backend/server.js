const express = require('express')
require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;
const fs = require('fs');
const path = require('path');
const pictureDir = '../pictures'

const db = require("./backend/models");
const Role = db.role;
const Country = db.country;
const Region = db.region;
const Address = db.address;
const User = db.user;
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");

var corsOptions = {
    origin: "http://localhost:8081"
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

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome" });
  });

require('./backend/routes/auth.routes')(app);
require('./backend/routes/users.routes')(app);
require('./backend/routes/admin.routes')(app);

app.listen(PORT, () => {
    console.log(`Serveur en ligne sur le porte ${PORT}.`);
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
	let countries = require('country-region-data/data.json');
	countries = countries.slice(0, 10); 

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
  }
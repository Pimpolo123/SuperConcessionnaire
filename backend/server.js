const express = require('express')
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;

const db = require("./backend/models");
const Role = db.role;
const Country = db.country;
const Region = db.region;
const Address = db.address;
const User = db.user;
const Op = db.Sequelize.Op;

var corsOptions = {
    origin: "http://localhost:8081"
  };  

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome" });
  });

require('./backend/routes/auth.routes')(app);
require('./backend/routes/users.routes')(app);

app.listen(PORT, () => {
    console.log(`Serveur en ligne sur le port ${PORT}.`);
  });

// SEULEMENT EN DEV !!! 
// PROD : 
db.sequelize.sync();
// et créer tout manuellement
// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });

function initial() {
	const countries = require('country-region-data/data.json');

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


	// User.create({
	// 	username: "jf",
	// 	email: "jf@jf.com",
	// 	password: "toto",
	// 	name: "toto",
	// 	surname: "toto",
	// });
	// Address.create({
	// 	id: 1,
	// 	country: "Belgique",
	// 	region: "Hainaut",
	// 	city: "Mons",
	// 	postcode: 730,
	// 	street: "Chemin de la Poterie",
	// 	housenumber: 52
    // })
	// .then(address => {
    //     address.setUser([1]);
    // });

	// User.create({
	// 	username: "jf",
	// 	email: "jf@jf.com",
	// 	password: "toto",
	// 	name: "toto",
	// 	surname: "toto",
	// })
    // .then(user => {
    //     user.setRoles([1]);
	// 	user.setAddress([1]);
    // });
	
  }
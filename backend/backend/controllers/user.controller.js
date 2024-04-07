const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Address = db.address;
const Country = db.country;
const Region = db.region;
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");
const testCountries = require('country-region-data/data.json');

exports.allAccess = (req, res) => {
	res.status(200).send("Public Content.");
};
  
exports.userBoard = (req, res) => {
	User.findOne({
		where: {
			id: req.body.user.id
		}
	}).then(user => {
		console.log(user.getAddress())
		res.status(200).send("ok");
	})
};
  
exports.adminBoard = (req, res) => {
	res.status(200).send("Admin Content.");
};
  
exports.moderatorBoard = (req, res) => {
	res.status(200).send("Moderator Content.");
};

exports.getCountryList = (req, res) => {
	Country.findAll().then(countries => {
		res.status(200).send(countries);
	});
	// res.status(200).send(testCountries);
}

exports.getRegionList = (req, res) => {
	Country.findOne({
		where: {
			id: req.body.id
		}
	}).then(country => {
		country.getRegions([country.id]).then(regions => {
			res.status(200).send(regions);
		})
	});
};

exports.editAddress = (req, res) => {
	User.findOne({
		where: {
			id: req.body.user.id
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send({message: "L'utilisateur n'existe pas"});
		}
		Address.create({
			country: req.body.address.country,
			region: req.body.address.region,
			city: req.body.address.city,
			postcode: req.body.address.postcode,
			street: req.body.address.street,
			housenumber: req.body.address.housenumber,
			boxnumber: req.body.address.boxnumber
		})
		.then(address => {
			user.setAddress(address.id);
			var authorities = [];
			user.getRoles().then(roles => {
				for (let i = 0; i < roles.length; i++) {
					authorities.push("ROLE_" + roles[i].name.toUpperCase());
				}
				return res.status(200).send({
					id: user.id,
					username: user.username,
					email: user.email,
					birthdate: user.birthdate,
					name: user.name,
					surname: user.surname,
					roles: authorities,
					message: "Adresse modifiée avec succès",
					accessToken: req.headers["x-access-token"],
					address: {
						id: address.id,
						country: address.country,
						region: address.region,
						city: address.city,
						postcode: address.postcode,
						street: address.street,
						housenumber: address.housenumber,
						boxnumber: address.boxnumber,
						userId: user.id
					}
				});
			})
		});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
};

exports.editProfile = (req, res) => {
	User.findOne({
		where: {
			username: req.body.username
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send({message: "L'utilisateur n'existe pas"});
		}
		var passwordIsValid = bcrypt.compareSync(
			req.body.password,
			user.password
		);
		if (!passwordIsValid) {
			return res.status(401).send({
				accessToken: null,
				message: "Mot de passe incorrect"
			});
		}

		user.surname = req.body.surname;
		user.name = req.body.name;
		user.birthdate = req.body.birthdate;		
		if(req.body.newpassword){
			user.password = bcrypt.hashSync(req.body.newpassword, 8)
		}
		user.save();

		var authorities = [];
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				authorities.push("ROLE_" + roles[i].name.toUpperCase());
			}
			return res.status(200).send({
				id: user.id,
				username: user.username,
				email: user.email,
				birthdate: user.birthdate,
				name: user.name,
				surname: user.surname,
				roles: authorities,
				message: "Profil modifié avec succès",
				accessToken: req.headers["x-access-token"],
			});
		});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
};
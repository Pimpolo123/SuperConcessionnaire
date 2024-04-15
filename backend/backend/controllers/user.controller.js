const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Address = db.address;
const Country = db.country;
const Region = db.region;
const Op = db.Sequelize.Op;
const fs = require('fs');
const path = require('path');
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
  
exports.moderatorBoard = (req, res) => {
	res.status(200).send("Moderator Content.");
};

exports.deleteUser = (req, res) => {
	User.destroy({
		where: {
			id: req.body.id
		}
	})
	res.status(200).send("Compte supprimé");
};

exports.uploadProfilePicture = (req, res) => {
	//Faire un pictureId dans la table users pour delete meme si l'extension change
	if(req.file.size > 5000000){
		res.status(500).send({ message: "Erreur : Fichier trop gros" });
	}

	if(!req.file || !req.body) {
		res.status(500).send({ message: "Erreur : Fichier ou informations manquantes" });
	}

	fs.renameSync(req.file.path, req.file.path.replace('undefined', req.body.username));
    res.status(200).send("La photo changera lors de la prochaine connexion");
};

exports.getCountryList = (req, res) => {
	Country.findAll().then(countries => {
		res.status(200).send(countries);
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
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
	}).catch(err => {
		res.status(500).send({ message: err.message });
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
		Address.findOrCreate({
			where: {userId: user.id},
			defaults: {
				country: req.body.address.country,
				region: req.body.address.region,
				city: req.body.address.city,
				postcode: req.body.address.postcode,
				street: req.body.address.street,
				housenumber: req.body.address.housenumber,
				boxnumber: req.body.address.boxnumber
			}
		}).then(address => {
			//address : array avec [1] = created ou non
			if(!address[1]){
				address[0].country = req.body.address.country,
				address[0].region = req.body.address.region,
				address[0].city = req.body.address.city,
				address[0].postcode = req.body.address.postcode,
				address[0].street = req.body.address.street,
				address[0].housenumber = req.body.address.housenumber,
				address[0].boxnumber = req.body.address.boxnumber
				address[0].save();
			}
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
						id: address[0].id,
						country: address[0].country,
						region: address[0].region,
						city: address[0].city,
						postcode: address[0].postcode,
						street: address[0].street,
						housenumber: address[0].housenumber,
						boxnumber: address[0].boxnumber,
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
		user.phonenumber = req.body.phonenumber;			
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
				phonenumber: user.phonenumber,
				roles: authorities,
				message: "Profil modifié avec succès",
				accessToken: req.headers["x-access-token"],
			});
		});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
};
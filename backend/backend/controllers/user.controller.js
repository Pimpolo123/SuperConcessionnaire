const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Address = db.address;
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");

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

exports.editAddress = (req, res) => {
	const userId = req.body.user.id;
	console.log(userId); 

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
			return res.status(200).send({message: "Nickel"});
		});
	})
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
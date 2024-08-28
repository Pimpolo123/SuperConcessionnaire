const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Address = db.address;
const Country = db.country;
const Favorite = db.favorite;
const Region = db.region;
const Message = db.message;
const Ticket = db.ticket;
const Car = db.car;
const Op = db.Sequelize.Op;
const fs = require('fs');
const path = require('path');
var bcrypt = require("bcryptjs");
const testCountries = require('country-region-data/data.json');

exports.allAccess = (req, res) => {
	res.status(200).send("Public Content.");
};
  
exports.getUser = (req, res) => {
	User.findOne({
		where: {
			id: req.body.userId
		},
		include: [Role, Address]
	}).then(user => {
		res.status(200).send(user);
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
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

exports.addFavorite = (req, res) => {
	Favorite.findOrCreate({
		where: {
			userId: req.body.userId,
			carId: req.body.carId
		},
		defaults: {
			userId: req.body.userId,
			carId: req.body.carId
		}
	}).then(favorite => {
		res.status(200).send({ message: "Voiture ajoutée aux favoris", newFavorite: favorite});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
};

exports.getFavorites = (req, res) => {
	const userId = req.query.userId;
	Favorite.findAll({
		where: {
			userId: userId
		}
	}).then(favorites => {
		res.status(200).send(favorites);
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.removeFavorite = (req, res) => {
	Favorite.destroy({
		where: {
			userId: req.body.userId,
			carId: req.body.carId
		}
	}).then(() => {
		res.status(200).send({ message: "Voiture retirée des favoris"});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.getMessagesFromUser = (req, res) => {
	const userId = req.query.userId;
	Message.findAll({
		where: {
			userId: userId
		},
		include: [User, Car]
	}).then(message => {
		res.status(200).send(message);
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.getMessagesToUser = (req, res) => {
	const toUserId = req.query.toUserId;
	Message.findAll({
		where: {
			toUserId: toUserId
		},
		include: [User, Car]
	}).then(message => {
		res.status(200).send(message);
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.getMessagesToRole = (req, res) => {
	const toRoleId = req.query.toRoleId;
	Message.findAll({
		where: {
			toRoleId: toRoleId
		},
		include: [User, Car]
	}).then(message => {
		res.status(200).send(message);
	}
	).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.addMessage = (req, res) => {
	Message.create({
		toRoleId: req.body.toRoleId,
		toUserId: req.body.toUserId,
		content: req.body.content,
		responseTo: req.body.responseTo,
		read: false,
		type: req.body.type,
		isOk: req.body.isOk,
		pdfId: req.body.pdfId
	}).then(message => {
		message.setUser(req.body.userId);
		message.setCar(req.body.carId);
		res.status(200).send({messageObject: message, message: "Message envoyé"});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.markAsRead = (req, res) => {
	Message.findOne({
		where: {
			id: req.body.id
		}
	}).then(message => {
		message.read = true;
		message.save();
		res.status(200).send({message: "Message marqué comme lu"});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.deleteMessage = (req, res) => {
	Message.destroy({
		where: {
			id: req.body.id
		}
	}).then(() => {
		res.status(200).send({message: "Message supprimé"});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.addTicket = (req, res) => {
	console.log(req.body);
	
	Ticket.create({
		subject: req.body.subject,
		userId: req.body.userId,
		responseTo: req.body.responseTo
	}).then(ticket => {
		Message.create({
			content: req.body.message,
			read: false,
			type: "ticket",
		}).then(message => {
			message.setTicket(ticket.id);
			message.setUser(req.body.userId);
		});
		res.status(200).send({message: "Ticket ajouté", ticket: ticket});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.getTicketsForUser = (req, res) => {
	const userId = req.query.userId;
	Ticket.findAll({
		where: {
			userId: userId
		},
		include: [Message, User]
	}).then(tickets => {
		res.status(200).send(tickets);
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.addMessageToTicket = (req, res) => {
	console.log(req.body);
	
	Ticket.findOne({
		where: {
			id: req.body.ticketId
		}
	}).then(ticket => {
		if(req.body.adminResponded){
			ticket.adminResponded = true;
		} else {
			ticket.adminResponded = false;
		}
		ticket.save();
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});

	Message.create({
		content: req.body.content,
		read: false,
		type: "ticket",
	}).then(message => {
		message.setTicket(req.body.ticketId);
		message.setUser(req.body.userId);
		res.status(200).send({message: "Message ajouté", mesId: message.id});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.getTicket = (req, res) => {
	const ticketId = req.query.ticketId
	Ticket.findOne({
		where: {
			id: ticketId
		},
		include: [Message, User]
	}).then(ticket => {
		res.status(200).send(ticket);
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.deleteTicket = (req, res) => {
	Ticket.destroy({
		where: {
			id: req.body.ticketId
		}
	}).then(() => {
		res.status(200).send({message: "Ticket supprimé"});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.setPreferences = (req, res) => {
	User.findOne({
		where: {
			id: req.body.userId
		}
	}).then(user => {
		user.emailPriceChange = req.body.emailPriceChange;
		user.emailCarSold = req.body.emailCarSold;
		user.emailBidWon = req.body.emailBidWon;
		user.save();
		res.status(200).send({message: "Préférences modifiées"});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

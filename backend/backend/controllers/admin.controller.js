const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Address = db.address;
const DealerInformations = db.dealerinformations;
const fs = require('fs');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getAllUsers = (req, res) => {
    var userList = [];

    User.findAll({
        	where : { id: {[Op.ne]: req.body.userId}}
        }).then(users => {
        var promises = users.map(user => {
            var authorities = [];
            return user.getRoles().then(roles => {
                roles.forEach(role => {
                    authorities.push("ROLE_" + role.name.toUpperCase());
                });
                return user.getAddress().then(address => {
                    
                    if (address == null) {
                        address = {};
                    }
                    userList.push({
                        user: user,
                        address: address,
                        roles: authorities,
                        imgUrl: base64_encode(user.username)
                    });
                });
            });
        });
        Promise.all(promises).then(() => {
            res.status(200).send(userList);
        });
    });
};

exports.adminBoard = (req, res) => {
	res.status(200).send("Admin Content.");
};

exports.banUser = (req, res) => {
    let message = ""
    if(req.body.banned){
        message = "Utilisateur banni"
    } else {
        message = "Utilisateur débanni"
    }
	User.findOne({
		where: {
			id: req.body.id
		}
	}).then(user => {
        if (!user) {
			return res.status(404).send({message: "L'utilisateur n'existe pas"});
		}
        user.banned = req.body.banned;
        user.save();
        return res.status(200).send({message: message});
    })
};

exports.deleteUser = (req, res) => {
	User.destroy({
		where: {
			id: req.body.id
		}
	}).then(() => {
		return res.status(200).send({message: "Utilisateur supprimé"});
    })
};

exports.editAddress = (req, res) => {
    let message = "";
	User.findOrCreate({
		where: {username: req.body.user.username},
		defaults: {
			username: req.body.user.username,
			email: req.body.user.email,
			password:  bcrypt.hashSync(req.body.user.password, 8),
			name: req.body.user.name,
			surname: req.body.user.surname,
			birthdate: req.body.user.birthdate,
			phonenumber: req.body.user.phonenumber,
		}
	}).then(user => {
		//user : array avec [1] = created ou non
		if (!user[1]) {
			user[0].name = req.body.user.name;
			user[0].surname = req.body.user.surname;
			user[0].birthdate = req.body.user.birthdate;
			user[0].phonenumber = req.body.user.phonenumber;
            user[0].setRoles(req.body.user.roles);
			user[0].save();
            message = "Utilisateur modifié avec succès";
		} else {
            user[0].setRoles(req.body.user.roles);
			user[0].save();
            message = "Utilisateur créé avec succès";
        }
		Address.findOrCreate({
			where: {userId: user[0].id},
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
			user[0].getRoles().then(roles => {
				for (let i = 0; i < roles.length; i++) {
					authorities.push("ROLE_" + roles[i].name.toUpperCase());
				}
				return res.status(200).send({
					id: user[0].id,
					username: user[0].username,
					email: user[0].email,
					birthdate: user[0].birthdate,
					name: user[0].name,
					surname: user[0].surname,
					roles: authorities,
					message: message,
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

		user.surname = req.body.surname;
		user.name = req.body.name;
		user.birthdate = req.body.birthdate;
		user.phonenumber = req.body.phonenumber;
        user.setRoles(req.body.roles);
		user.save();

		var authorities = [];
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				authorities.push("ROLE_" + roles[i].name.toUpperCase());
			}
			return res.status(200).send({
				message: "Profil modifié avec succès",
				accessToken: req.headers["x-access-token"],
			});
		});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
};

exports.updateDealerInformations = (req, res) => {
	DealerInformations.findOrCreate({
		where: {id: 1},
		defaults: {
			dealershipName: req.body.dealershipName,
			bankAccount: req.body.bankAccount,
			country: req.body.country,
			region: req.body.region,
			postcode: req.body.postcode,
			city: req.body.city,
			street: req.body.street,
			number: req.body.number,
			phoneNumber: req.body.phoneNumber
		}
	}).then(dealer => {
		//dealer : array avec [1] = created ou non
		if(!dealer[1]){
			dealer[0].dealershipName = req.body.dealershipName;
			dealer[0].bankAccount = req.body.bankAccount;
			dealer[0].country = req.body.country;
			dealer[0].region = req.body.region;
			dealer[0].postcode = req.body.postcode;
			dealer[0].city = req.body.city;
			dealer[0].street = req.body.street;
			dealer[0].number = req.body.number;
			dealer[0].phoneNumber = req.body.phoneNumber;
			dealer[0].save();
		}
		return res.status(200).send({
			id: dealer[0].id,
			dealershipName: dealer[0].dealershipName,
			bankAccount: dealer[0].bankAccount,
			country: dealer[0].country,
			region: dealer[0].region,
			postcode: dealer[0].postcode,
			city: dealer[0].city,
			street: dealer[0].street,
			number: dealer[0].number,
			phoneNumber: dealer[0].phoneNumber,
		});
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}

exports.getDealerInformations = (req, res) => {
	DealerInformations.findOne({
		where: {
			id: 1
		}
	}).then(dealer => {
		if (!dealer) {
			return res.status(404).send({message: "Les informations du concessionnaire n'existent pas"});
		}
		return res.status(200).send(dealer);
	}).catch(err => {
		res.status(500).send({ message: err.message });
	});
}


function base64_encode(fileUsername) {
	const files = fs.readdirSync('../pictures/user');
	for (const file of files) {
        if (file.split('.')[0] == fileUsername) {
            var bitmap = fs.readFileSync('../pictures/user/' + file);
    		return Buffer.from(bitmap).toString('base64');
        }
    }
    return '';
}
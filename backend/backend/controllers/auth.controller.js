const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const fs = require('fs');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  	User.create({
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8),
		birthdate: req.body.birthdate,
		name: req.body.name,
		surname: req.body.surname,
		phonenumber: req.body.phonenumber
	})
    .then(user => {
        user.setRoles(req.body.roles).then(() => {
          res.send({ message: "Utilisateur inscrit avec succès" });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      [Op.or]:[{
        email: req.body.email
      },{
		username: req.body.username
	}]
    }
  }).then(user => {
		if (!user) {
			return res.status(404).send({message: "L'utilisateur n'existe pas"});
		}

		if (user.banned) {
			return res.status(403).send({message: "Vous êtes banni"});
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

		const token = jwt.sign({ id: user.id },
								config.secret,
								{
									algorithm: 'HS256',
									allowInsecureKeySizes: true,
									expiresIn: 86400, // 24 hours
								});

		var authorities = [];
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				authorities.push("ROLE_" + roles[i].name.toUpperCase());
			}
			user.getAddress().then(address => {
				if(address == null){
					address = {};
				}
				res.status(200).send({
					id: user.id,
					username: user.username,
					email: user.email,
					birthdate: user.birthdate,
					name:user.name,
					surname: user.surname,
					phonenumber: user.phonenumber,
					banned: user.banned,
					roles: authorities,
					accessToken: token,
					address: address,
					imgUrl: base64_encode(user.username)
				});
			})
		});
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

function base64_encode(fileUsername) {
	const files = fs.readdirSync('../pictures');
	for (const file of files) {
        if (file.split('.')[0] == fileUsername) {
            var bitmap = fs.readFileSync('../pictures/' + file);
    		return Buffer.from(bitmap).toString('base64');
        }
    }
	return '';
}
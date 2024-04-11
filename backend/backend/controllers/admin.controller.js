const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
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
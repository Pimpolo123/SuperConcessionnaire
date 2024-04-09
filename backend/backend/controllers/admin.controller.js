const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const fs = require('fs');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getAllUsers = (req, res) => {
    User.findAll().then(users=> {
        res.status(200).send(users);
    });
};

exports.adminBoard = (req, res) => {
	res.status(200).send("Admin Content.");
};

function base64_encode(fileUsername) {
	const files = fs.readdirSync('../pictures');
	for (const file of files) {
        if (file.startsWith(fileUsername)) {
            var bitmap = fs.readFileSync('../pictures/' + file);
    		return Buffer.from(bitmap).toString('base64');
        }
    }
}
const db = require("../models");
const fs = require('fs');
const path = require('path');
const Appointment = db.appointment;

const Op = db.Sequelize.Op;

exports.addAppointment = (req, res) => {
    console.log('REQ', req.body);
    Appointment.create({
        day: req.body.appointment.day,
        time: req.body.appointment.time
    })
    .then(appointment => {
        res.send({ message: "Appointment added successfully!" });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getAll = (req, res) => {
    Appointment.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}



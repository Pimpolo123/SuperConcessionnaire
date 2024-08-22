const db = require("../models");
const fs = require('fs');
const path = require('path');
const Appointment = db.appointment;
const Availability = db.availability;

const Op = db.Sequelize.Op;

exports.addAppointment = (req, res) => {
    console.log('REQ', req.body);
    Appointment.create({
        day: req.body.appointment.day,
        time: req.body.appointment.time,
        userId: req.body.appointment.userId
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

exports.setAvailability = (req, res) => {
    console.log('REQ', req.body);
    Availability.create({
        openingDays: req.body.availability.openingDays,
        openingTime: req.body.availability.openingTime,
        closingTime: req.body.availability.closingTime,
        availableHours: req.body.availability.availableHours,
        day: req.body.availability.day,
        week: req.body.availability.week,
        month: req.body.availability.month,
        year: req.body.availability.year
    })
    .then(availability => {
        res.send({ message: "Availability set successfully!" });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getAvailability = (req, res) => {
    Availability.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}



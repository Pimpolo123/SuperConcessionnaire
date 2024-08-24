const db = require("../models");
const fs = require('fs');
const path = require('path');
const Appointment = db.appointment;
const Availability = db.availability;
const User = db.user;

const Op = db.Sequelize.Op;

exports.addAppointment = (req, res) => {
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
    Appointment.findAll({
        include : [User]
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.deleteAppointment = (req, res) => {
    const id = req.query.id;
    Appointment.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({ message: "Appointment deleted successfully!" });
        } else {
            res.send({ message: `Cannot delete Appointment with id=${id}. Maybe Appointment was not found!` });
        }
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



const { authJwt } = require("../middleware");
const controller = require("../controllers/appointment.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/appointment/addappointment",
        [authJwt.verifyToken],
        controller.addAppointment
    );

    app.get(
        "/appointment/getall",
        [authJwt.verifyToken],
        controller.getAll
    );

    app.get(
        "/appointment/deleteappointment",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAppointment
    )

    app.post(
        "/appointment/setavailability",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.setAvailability
    );

    app.get(
        "/appointment/getavailability",
        [authJwt.verifyToken],
        controller.getAvailability
    );
};
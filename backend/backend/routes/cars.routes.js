const { authJwt } = require("../middleware");
const controller = require("../controllers/cars.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/cars/getallcars",
        [authJwt.verifyToken],
        controller.getAllCars
    );

    app.get(
        "/cars/getcar/:id",
        [authJwt.verifyToken],
        controller.getCar
    );
};
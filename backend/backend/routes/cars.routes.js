const { authJwt } = require("../middleware");
const controller = require("../controllers/cars.controller");
const upload = require('../middleware/verifyCarPics')

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
        controller.getAllCars
    );

    app.get(
        "/cars/getcar",
        controller.getCar
    );

    app.post('/cars/addcar', [upload.array('files', 20), authJwt.verifyToken, authJwt.isModeratorOrAdmin], controller.addCar);
};
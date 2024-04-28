const { authJwt, verifyCarPics } = require("../middleware");
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

    app.get(
        "/cars/deletecar",
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin], 
        controller.deleteCar
    );

    app.post(
        '/cars/addcar', 
        [verifyCarPics.memStorage.array('files', 20), verifyCarPics.validateFiles, authJwt.verifyToken, authJwt.isModeratorOrAdmin], 
        controller.addCar
    );

    app.post(
        '/cars/editcar', 
        [verifyCarPics.memStorage.array('files', 20), verifyCarPics.validateFiles, authJwt.verifyToken, authJwt.isModeratorOrAdmin], 
        controller.editCar
    );
};
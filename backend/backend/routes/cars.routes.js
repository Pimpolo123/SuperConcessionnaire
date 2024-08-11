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
        '/cars/deletecars', 
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin], 
        controller.deleteCars
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
    
    app.post(
        '/cars/setbid',
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
        controller.setBid
    )

    app.get(
        '/cars/getallmakes',
        controller.getAllMakes
    );

    app.get(
        '/cars/getmodels',
        controller.getModels
    );

    app.get(
        '/cars/getallcategories',
        controller.getAllCategories
    );

    app.get(
        '/cars/getalladmissiontypes',
        controller.getAllAdmissionTypes
    );

    app.get(
        '/cars/getallcolors',
        controller.getAllColors
    );

    app.get(
        '/cars/getallfueltypes',
        controller.getAllFuelTypes
    );

    app.get(
        '/cars/getalldrivetrains',
        controller.getAllDrivetrains
    );

    app.get(
        '/cars/getallgearboxtypes',
        controller.getAllGearboxTypes
    );

    app.get(
        '/cars/getalleuros',
        controller.getAllEuros
    );

    app.get(
        '/cars/getalloptions',
        controller.getAllOptions
    );

    app.post(
        '/cars/addsale',
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
        controller.addSale
    );

    app.get(
        '/cars/getsales',
        controller.getSales
    );

    app.post(
        '/cars/setcarsasold',
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
        controller.setCarsAsOld
    );
};
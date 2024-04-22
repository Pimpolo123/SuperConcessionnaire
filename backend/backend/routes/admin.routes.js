const { authJwt } = require("../middleware");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/admin/getallusers",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getAllUsers
    );

    app.get(
        "/admin/board",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );

    app.post(
        "/admin/editprofile",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.editProfile
    );

    app.post(
        "/admin/editaddress",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.editAddress
    );
};
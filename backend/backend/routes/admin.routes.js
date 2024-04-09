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

    app.get(
        "/admin/getallusers",
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
        controller.getAllUsers
    );

    app.get(
        "/admin/board",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
};
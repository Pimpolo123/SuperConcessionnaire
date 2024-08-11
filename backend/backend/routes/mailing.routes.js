const { authJwt } = require("../middleware");
const controller = require("../controllers/mailing.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/mailing/sendemail",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.sendEmail
    );

    app.post(
        "/mailing/setnewsletterinfos",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.setNewsletterInfos
    );

    app.get(
        "/mailing/getnewsletterinfos",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getNewsletterInfos
    );
};
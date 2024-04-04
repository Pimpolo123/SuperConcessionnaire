const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/test/all", controller.allAccess);

  app.post(
    "/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post(
    "/editprofile",
    [authJwt.verifyToken],
    controller.editProfile
  );

  app.post(
    "/editaddress",
    [authJwt.verifyToken],
    controller.editAddress
  );
};
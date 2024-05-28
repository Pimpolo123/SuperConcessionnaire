const { authJwt } = require("../middleware");
const controller = require("../controllers/bid.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/bid/getallbids",
        controller.getAllBids
    );

    app.get(
        "/bid/getbid",
        controller.getBid
    );

    app.post(
        '/bid/addbid', 
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin], 
        controller.addBid
    );
    
    app.post(
        '/bid/updatebid', 
        [authJwt.verifyToken], 
        controller.updateBid
    );

    app.post(
        '/bid/deletebid', 
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin], 
        controller.deleteBid
    );
};
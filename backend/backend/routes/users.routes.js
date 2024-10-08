const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const upload = require('../middleware/verifyFile')

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
        "/getuser",
        [authJwt.verifyToken],
        controller.getUser
    );

    app.get(
        "/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
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

    app.get(
        "/getcountrylist",
        [authJwt.verifyToken],
        controller.getCountryList
    );

    app.post(
        "/getregionlist",
        [authJwt.verifyToken],
        controller.getRegionList
    );

    app.post(
        "/deleteuser",
        [authJwt.verifyToken],
        controller.deleteUser
    );

    app.post('/uploadpicture', upload.single('file'), controller.uploadProfilePicture);

    app.post(
        "/addfavorite", 
        [authJwt.verifyToken], 
        controller.addFavorite
    );

    app.post(
        "/removefavorite", 
        [authJwt.verifyToken], 
        controller.removeFavorite
    );

    app.get(
        "/getfavorites", 
        [authJwt.verifyToken], 
        controller.getFavorites
    );

    app.get(
        "/getmessagestouser", 
        [authJwt.verifyToken], 
        controller.getMessagesToUser
    );

    app.get(
        "/getmessagesfromuser", 
        [authJwt.verifyToken], 
        controller.getMessagesFromUser
    );

    app.get(
        "/getmessagestorole", 
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin], 
        controller.getMessagesToRole
    );

    app.post(
        "/addmessage", 
        [authJwt.verifyToken], 
        controller.addMessage
    );

    app.post(
        "/markasread",
        [authJwt.verifyToken],
        controller.markAsRead
    )

    app.post(
        "/deletemessage",
        [authJwt.verifyToken],
        controller.deleteMessage
    )

    app.post(
        "/addticket",
        [authJwt.verifyToken],
        controller.addTicket
    )

    app.get(
        "/getticketsforuser",
        [authJwt.verifyToken],
        controller.getTicketsForUser
    )

    app.post(
        "/addmessagetoticket",
        [authJwt.verifyToken],
        controller.addMessageToTicket
    )

    app.get(
        "/getticket",
        [authJwt.verifyToken],
        controller.getTicket
    )

    app.post(
        "/deleteticket",
        [authJwt.verifyToken],
        controller.deleteTicket
    )

    app.post(
        "/setpreferences",
        [authJwt.verifyToken],
        controller.setPreferences
    )
};
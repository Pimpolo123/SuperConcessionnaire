const { authJwt } = require("../middleware");
const controller = require("../controllers/pdf.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        '/admin/downloadpdf', 
        [authJwt.verifyToken], 
        controller.generatePDF
    );

    app.post(
        '/admin/addpdfinfos', // admin parce que dans admin service front
        [authJwt.verifyToken], 
        controller.addPdfInfos
    );
};
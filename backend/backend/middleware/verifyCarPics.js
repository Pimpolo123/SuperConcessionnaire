const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage()

validateFiles = (req, res, next) => {
    if(!req.files) {
        return res.status(500).send({ message: "Erreur : Fichier manquant" });
    }
    req.files.forEach(file => {
        if(file.size > 5000000){
            return res.status(500).send({ message: "Erreur : Fichier trop gros" });
        }
        if(file.mimetype.split('/')[0] != 'image'){
            return res.status(500).send({ message: "Erreur : Type non autorisé" });
        }
        if(JSON.parse(req.body.car).description.length > 2000){
            return res.status(500).send({ message: "Erreur : Description trop longue" });
        }
    })
    next();
}

memStorage = multer({ 
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
      }
})

const verifyCarPics = {
    memStorage: memStorage,
    validateFiles: validateFiles
}

module.exports = verifyCarPics;
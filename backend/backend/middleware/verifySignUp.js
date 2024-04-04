const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkUserDuplicate = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Erreur : Nom d'utilisateur déja utilisé"
      });
      return;
    }

    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Erreur : Email déja utilisé"
        });
        return;
      }

      next();
    });
  });
};


checkRolesExists = (req, res, next) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).send({
            message: "Erreur : le role n'existe pas :  " + req.body.roles[i]
          });
          return;
        }
      }
    }
    
    next();
};

const verifySignUp = {
    checkUserDuplicate: checkUserDuplicate,
    checkRolesExists: checkRolesExists
  };
  
module.exports = verifySignUp;
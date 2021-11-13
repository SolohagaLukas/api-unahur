var express = require("express");
var router = express.Router();
var models = require("../models");
const user = require("../models/user");

// Controllers
const AuthController = require('../controllers/AuthController')

router.get("/", (req, res) => {
    console.log("Esto es un mensaje para ver en consola");
    models.user
      .findAll({
        attributes: ["name", "password", "email"],
      })
      .then(user => res.send(user))
      .catch(() => res.sendStatus(500));
  });
  
//Dos rutas: login y registro
router.post("/signin", AuthController.signIn);
router.post("/signup", AuthController.signUp);

  const findUser = (id, { onSuccess, onNotFound, onError }) => {
    models.user
      .findOne({
        attributes: ["id", "name", "password", "email"],
        where: { id }
      })
      .then(user => (user ? onSuccess(user) : onNotFound()))
      .catch(() => onError());
  };
  
  router.get("/:id", (req, res) => {
    findUser(req.params.id, {
      onSuccess: user => res.send(user),
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });
  
  router.put("/:id", (req, res) => {
    const onSuccess = user =>
      user
        .update({ name: req.body.name }, { fields: ["name"] })
        .update({ password: req.body.password }, { fields: ["password"] })
        .update({ email: req.body.email }, { fields: ["email"] })
        .then(() => res.sendStatus(200))
        .catch(error => {
          if (error == "SequelizeUniqueConstraintError: Validation error") {
            res.status(400).send('Bad request: existe otro user con el mismo nombre')
          }
          else {
            console.log(`Error al intentar actualizar la base de datos: ${error}`)
            res.sendStatus(500)
          }
        });
      findUser(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });
  
  router.delete("/:id", (req, res) => {
    const onSuccess = user =>
      user
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findUser(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });
  
  module.exports = router;
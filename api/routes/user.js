var express = require("express");
var router = express.Router();
var models = require("../models");
const user = require("../models/user");
const post = require("../models/post");

// Middlewares
const auth = require('../middlewares/auth');

// Controllers
const AuthController = require('../controllers/AuthController');
const PostController = require('../controllers/PostController');

//Para obtener(GET) todos los usuarios

router.get("/users", (req, res) => {
    console.log("Esto es un mensaje para ver en consola");
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    let page = 0;
    if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    
    let size = 10;
    if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
      size = sizeAsNumber;
    }

    models.user
      .findAndCountAll({
        limit: size,
        offset: page * size,
        attributes: ["name", "password", "email"],
      })
      .then(user => res.send({
        //user
        content: user.rows,
        totalPages: Math.ceil(user.count / size)
      }))
      .catch(() => res.sendStatus(500));
  });

//Dos rutas: login y registro
router.post("/signin", AuthController.signIn);
router.post("/signup", AuthController.signUp);

router.get('/posts', auth, PostController.index);
/*
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
  */
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
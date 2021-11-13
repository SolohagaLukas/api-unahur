const { user } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = {
    //Login
    signIn(req, res) {
        let { email, password } = req.body;

        // Buscar usuario
        user.findOne({
            where: {
                email: email
            }
        }).then(user => {
            if(!user) {
                res.status(404).json({ msg: "No se ha encontrado un usuario con este correo" });
            } else {
                if(bcrypt.compareSync(password, user.password)) {
                    //Si las contraseñas coinciden devolvemos token
                    //Creamos token
                    let token = jwt.sign({ user: user }, authConfig.secret, {
                        expiresIn: authConfig.expires
                    });

                    res.json({
                        user: user,
                        token: token
                    })

                } else {
                    //Unauthorized access
                    res.status(401).json({ msg: "Contraseña incorrecta" })
                }
            }
        }).catch(err => {
            res.status(500).json(err);
        })
    },

    //Registro
    signUp(req, res) {

        // Encriptamos la contraseña
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));

        //Crear un usuario
        user.create({
            name: req.body.name,
            email: req.body.email,
            password: password
        }).then(user => {
            // Creamos el token
            let token = jwt.sign({ user: user }, authConfig.secret, {
                expiresIn: authConfig.expires
            });

            res.json({
                user: user,
                token: token
            });

        }).catch(err => {
            res.status(500).json(err);
        });
    }
}
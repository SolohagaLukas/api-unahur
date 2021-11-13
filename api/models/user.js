'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: "El nombre solo puede contener letras"
        },
        len: {
          args: [2, 255],
          msg: "El nombre tiene que ser de al menos 2 caracteres"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6,255],
          msg: "La contraseña tiene que tener al menos 6 caracteres"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "El email tiene que ser un correo valido"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
'use strict';

const { user } = require('../models/index');
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      user.create({
        name: "Lukas",
        email: "lukas@gmail.com",
        password: bcrypt.hashSync("123456", +authConfig.rounds),
        posts: [
          {
            title: "Title 1",
            body: "Body 1"
          },
          {
            title: "Title 2",
            body: "Body 2"
          }
        ]
      }, {
        include: "posts"
      }),

      user.create({
        name: "Brisa",
        email: "brisa@gmail.com",
        password: bcrypt.hashSync("123456", +authConfig.rounds),
        posts: [
          {
            title: "Title 3",
            body: "Body 3"
          },
          {
            title: "Title 4",
            body: "Body 4"
          }
        ]
      }, {
        include: "posts"
      })

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    
    return Promise.all([
      queryInterface.bulkDelete('post', null, {}),
      queryInterface.bulkDelete('user', null, {})
    ]);
    
  }
};

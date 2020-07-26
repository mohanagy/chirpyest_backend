'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: function (queryInterface) {
    return Promise.all([
      queryInterface.addColumn('users', 'username', { type: Sequelize.STRING, unique: true, allowNull: true }),
    ]);
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn('users', 'username');
  },
};

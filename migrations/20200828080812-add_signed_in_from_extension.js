'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: function (queryInterface) {
    return Promise.all([
      queryInterface.addColumn('users', 'signed_in_from_extension', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
    ]);
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn('users', 'signed_in_from_extension');
  },
};

'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: function (queryInterface) {
    return Promise.all([
      queryInterface.addColumn('users', 'extension_downloaded', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
    ]);
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn('users', 'extension_downloaded');
  },
};

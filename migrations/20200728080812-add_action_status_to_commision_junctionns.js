'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: function (queryInterface) {
    return Promise.all([
      queryInterface.addColumn('commission_junction_transactions', 'action_status', {
        type:  Sequelize.DataTypes.STRING,
      }),
    ]);
  },

  down: function (queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('commission_junction_transactions', 'action_status'),
    ]);

  },
};

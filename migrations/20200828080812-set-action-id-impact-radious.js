'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: function (queryInterface) {
    return Promise.all([
      queryInterface.changeColumn('impact_radius_transactions', 'action_id', {
        type: Sequelize.DataTypes.STRING,
        unique: true,
      }),
    ]);
  },

  down: function (queryInterface) {
    return Promise.all([
      queryInterface.changeColumn('impact_radius_transactions', 'action_id', {
        type: Sequelize.DataTypes.STRING,
        unique: false,
      }),
    ]);
  },
};

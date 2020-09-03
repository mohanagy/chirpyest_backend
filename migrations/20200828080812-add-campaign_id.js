'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: function (queryInterface) {
    return Promise.all([
      queryInterface.addColumn('impact_radius_transactions', 'campaign_id', {
        type: Sequelize.DataTypes.STRING,
      }),
    ]);
  },

  down: function (queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('impact_radius_transactions', 'campaign_id'),
    ]);
  },
};

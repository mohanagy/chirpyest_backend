'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: function (queryInterface) {
    return Promise.all([
      queryInterface.changeColumn('payments_transactions', 'half_month_id', {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      }),
    ]);
  },

  down: function (queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('payments_transactions', 'half_month_id'),
    ]);

  },
};

'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: function (queryInterface) {
    return Promise.all([
      queryInterface.changeColumn('rakuten_transactions', 'etransaction_id', {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false,
      }),
    ]);
  },

  down: function (queryInterface) {
    return Promise.all([
      queryInterface.changeColumn('rakuten_transactions', 'etransaction_id', {
        type: Sequelize.DataTypes.STRING,
        unique: false,
      }),
    ]);
  },
};

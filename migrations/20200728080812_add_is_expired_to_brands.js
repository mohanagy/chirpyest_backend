'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: function (queryInterface) {
    return Promise.all([
      queryInterface.addColumn('brands', 'is_expired', {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },

  down: function (queryInterface) {
    return Promise.all([queryInterface.removeColumn('brands', 'is_expired')]);
  },
};

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'brands',
          'is_expired',
          {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'brands',
          'is_deleted',
          {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'brands',
          'is_trending',
          {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t },
        ),
        queryInterface.bulkUpdate(
          'brands',
          {
            is_deleted: false,
            is_trending: false,
          },
          { transaction: t },
        ),
      ]);
    });
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeColumn('brands', 'is_expired', { transaction: t })]);
    });
  },
};

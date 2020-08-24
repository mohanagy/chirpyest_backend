'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'brands',
          'is_trending',
          {
            type: Sequelize.DataTypes.BOOLEAN,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'brands',
          'is_deleted',
          {
            type: Sequelize.DataTypes.BOOLEAN,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'brands',
          'category',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t },
        ),
      ]);
    });
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('brands', 'category', { transaction: t }),
        queryInterface.removeColumn('brands', 'is_trending', { transaction: t }),
        queryInterface.removeColumn('brands', 'is_deleted', { transaction: t }),
      ]);
    });
  },
};

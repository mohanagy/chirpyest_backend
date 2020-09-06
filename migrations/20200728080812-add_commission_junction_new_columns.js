'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'commission_junction_transactions',
          'validation_status',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'commission_junction_transactions',
          'reviewed_status',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'commission_junction_transactions',
          'action_type',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'commission_junction_transactions',
          'source',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'commission_junction_transactions',
          'website_id',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'commission_junction_transactions',
          'shopper_id',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'commission_junction_transactions',
          'website_name',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'commission_junction_transactions',
          'locking_method',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'commission_junction_transactions',
          'original_actionId',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'commission_junction_transactions',
          'site_to_store_offer',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t },
        ),
        // bool
        queryInterface.addColumn(
          'commission_junction_transactions',
          'original',
          {
            type: Sequelize.DataTypes.BOOLEAN,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'commission_junction_transactions',
          'event_date',
          {
            type: Sequelize.DataTypes.DATE,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'commission_junction_transactions',
          'locking_date',
          {
            type: Sequelize.DataTypes.DATE,
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

'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  up: function (queryInterface) {
    return Promise.all([
      queryInterface.changeColumn('commission_junction_transactions', 'sale_amount_pub_currency', {
        type:  'float USING CAST("sale_amount_pub_currency" as float)',
        defaultValue:0
      }),
      queryInterface.changeColumn('commission_junction_transactions', 'order_discount_usd', {
        type: 'float USING CAST("order_discount_usd" as float)',
        defaultValue:0

      }),
      queryInterface.changeColumn('commission_junction_transactions', 'order_discount_pub_currency', {
        type: 'float USING CAST("order_discount_pub_currency" as float)',
        defaultValue:0
      }),
    ]);
  },

  down: function (queryInterface) {},
};

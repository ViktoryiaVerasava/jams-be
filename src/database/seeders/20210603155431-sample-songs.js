'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Songs', [{
      name: 'Marseillaise',
      instruments: new Array('guitar', 'rebab'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Nation Anthem',
      instruments: new Array('viol', 'viol', 'rebab'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Advance Australia Fair',
      instruments: new Array('guitar', 'rebab', 'piano'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Songs', null, {});
  }
};

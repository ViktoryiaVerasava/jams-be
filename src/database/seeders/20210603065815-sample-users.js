'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'Bear',
          lastName: 'Brown',
          email: 'b.brown@test.com',
          password: 'password',
          instrument: 'viol',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Otter',
          lastName: 'Marine',
          email: 'o.marine@test.com',
          password: 'password',
          instrument: 'rebab',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Uhu',
          lastName: 'forest',
          email: 'u.forest@test.com',
          password: 'password',
          instrument: 'guitar',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};

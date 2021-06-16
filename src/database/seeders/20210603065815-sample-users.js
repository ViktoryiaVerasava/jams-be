'use strict';
import bcrypt from 'bcryptjs';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'Bear',
          lastName: 'Brown',
          email: 'b.brown@test.com',
          password: bcrypt.hashSync('password', 8),
          phone: '1234',
          instrument: 'viol',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Otter',
          lastName: 'Marine',
          email: 'o.marine@test.com',
          password: bcrypt.hashSync('password', 8),
          phone: '12334',
          instrument: 'rebab',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Uhu',
          lastName: 'forest',
          email: 'u.forest@test.com',
          password: bcrypt.hashSync('password', 8),
          phone: '152334',
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

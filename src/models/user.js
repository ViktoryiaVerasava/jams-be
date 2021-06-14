import { Model } from 'sequelize';

const PROTECTED_ATTRIBUTES = ['password'];

export default (sequelize, DataTypes) => {
  class User extends Model {
    toJSON() {
      // hide protected fields
      const attributes = { ...this.get() };
      // eslint-disable-next-line no-restricted-syntax
      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Jam, {
        through: models.JamUsers,
        foreignKey: 'userId',
        as: 'participations'
      });
      User.hasMany(models.Jam, {
        foreignKey: 'userId',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter your email address',
          },
          isEmail: {
            args: true,
            msg: 'Please enter a valid email address',
          },
        },
      },
      instrument: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter your instrument',
          },
        },
      },
      password: DataTypes.STRING,
      phone: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};

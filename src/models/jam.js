import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Jam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Jam.belongsTo(models.Song, {
        targetKey: 'id',
        foreignKey: 'songId',
        allowNull: false,
        as: 'song',
      });
      Jam.belongsTo(models.User, {
        targetKey: 'id',
        foreignKey: 'userId',
        allowNull: false,
        as: 'host',
      });
      Jam.belongsToMany(models.User, {
        through: models.JamUsers,
        foreignKey: 'jamId',
        as: 'participants',
      });
    }
  }
  Jam.init(
    {
      isStarted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      isStarted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Jam',
    }
  );

  return Jam;
};

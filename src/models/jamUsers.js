import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class JamUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      JamUsers.belongsTo(models.Jam, { targetKey: 'id', foreignKey: 'jamId', allowNull: false });
      JamUsers.belongsTo(models.User, { targetKey: 'id', foreignKey: 'userId', allowNull: false });
    }
  };
  JamUsers.init({
    userId: {
      type: DataTypes.INTEGER,
    },
    jamId: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'JamUsers',
  });
  return JamUsers;
};
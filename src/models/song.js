import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {

  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Song.hasMany(models.Jam, {
        foreignKey: 'songId',
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    }
  };
  Song.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter song name'
        }
      }
    },
    instruments: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'Song',
  });

  return Song;
};
export default function (sequelize, DataTypes) {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  }, {});

  Tag.associate = function (models) {
    // associations can be defined here
    models.Tag.belongsToMany(models.Task, { through: 'TaskTag', foreignKey: 'tagId' });
  };

  return Tag;
}

export default function (sequelize, DataTypes) {
  const Tag = sequelize.define('tag', {
    name: {
      type: DataTypes.STRING,
      isUnique: true,
      validate: {
        notEmpty: true,
      },
    },
  }, {});

  Tag.associate = function (models) {
    // associations can be defined here
    models.tag.belongsToMany(models.task, { through: 'taskTag', foreignKey: 'tagId', as: 'tasks' });
  };

  return Tag;
}

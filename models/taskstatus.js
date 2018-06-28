export default function (sequelize, DataTypes) {
  const TaskStatus = sequelize.define('TaskStatus', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  }, {});

  TaskStatus.associate = function (models) {
    // associations can be defined here
    models.TaskStatus.hasMany(models.Task, { foreignKey: 'status' });
  };

  return TaskStatus;
}

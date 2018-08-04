export default function (sequelize, DataTypes) {
  const TaskStatus = sequelize.define('taskStatus', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  }, {});

  TaskStatus.associate = function (models) {
    // associations can be defined here
    models.taskStatus.hasMany(models.task, { foreignKey: 'status' });
  };

  return TaskStatus;
}

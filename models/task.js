export default function (sequelize, DataTypes) {
  const Task = sequelize.define('task', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      references: {
        model: 'TaskStatus',
        key: 'id',
      },
    },
    creatorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    assignedToId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    },
  }, {});

  Task.associate = function (models) {
    // associations can be defined here
    models.task.belongsTo(models.user, { foreignKey: 'creatorId', as: 'creator' });
    models.task.belongsTo(models.user, { foreignKey: 'assignedToId', as: 'worker' });
    models.task.belongsTo(models.taskStatus, { foreignKey: 'status' });
    models.task.belongsToMany(models.tag, { through: 'taskTag', foreignKey: 'taskId', as: 'tags' });
  };

  return Task;
}

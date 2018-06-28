export default function (sequelize, DataTypes) {
  const Task = sequelize.define('Task', {
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
    creator: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    },
  }, {});

  Task.associate = function (models) {
    // associations can be defined here
    models.Task.belongsTo(models.User, { foreignKey: 'creator' , as: 'Creator' });
    models.Task.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'Worker' });
    models.Task.belongsTo(models.TaskStatus, { foreignKey: 'status', as: 'Status' });
    models.Task.belongsToMany(models.Tag, { through: 'TaskTag', foreignKey: 'taskId' });
  };

  return Task;
}

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
        model: 'taskStatuses',
        key: 'id',
      },
    },
    creatorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    assignedToId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    scopes: {
      creatorTasks: (id => ({
        where: {
          creatorId: id,
        },
      })),
      assignedToTasks: (id => ({
        where: {
          assignedToId: id,
        },
      })),
      tasksByStatus: (id => ({
        where: {
          status: id,
        },
      })),
    },
  });

  Task.associate = function (models) {
    // associations can be defined here
    models.task.belongsTo(models.user, { foreignKey: 'creatorId', as: 'creator' });
    models.task.belongsTo(models.user, { foreignKey: 'assignedToId', as: 'worker' });
    models.task.belongsTo(models.taskStatus, { foreignKey: 'status' });
    models.task.belongsToMany(models.tag, { through: 'taskTag', foreignKey: 'taskId', as: 'tags' });
  };

  Task.loadScopes = (models) => {
    Task.addScope('hasTag', (tagsArray => ({
      include: [
        {
          model: models.tag,
          as: 'tags',
          where: {
            name: {
              [sequelize.Op.or]: tagsArray.map(t => ({ [sequelize.Op.like]: `%${t}%` })),
            },
          },
        },
      ],
    })));
  };

  return Task;
}

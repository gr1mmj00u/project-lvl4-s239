export default (sequelize, DataTypes) => {
  const TaskTag = sequelize.define('taskTag', {
    taskId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Task',
        key: 'id',
      },
    },
    tagId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Status',
        key: 'id',
      },
    },
  }, {});

  TaskTag.associate = function (models) {
    // associations can be defined here
  };

  return TaskTag;
};

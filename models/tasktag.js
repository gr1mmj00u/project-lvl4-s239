module.exports = (sequelize, DataTypes) => {
  const TaskTag = sequelize.define('TaskTag', {
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

export default (sequelize, DataTypes) => {
  const TaskTag = sequelize.define('taskTag', {
    taskId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tasks',
        key: 'id',
      },
    },
    tagId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tags',
        key: 'id',
      },
    },
  }, {});

  TaskTag.associate = function (models) {
    // associations can be defined here
  };

  return TaskTag;
};

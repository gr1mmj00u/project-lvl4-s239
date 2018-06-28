export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('TaskTags', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    taskId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    tagId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export const down = (queryInterface, Sequelize) => queryInterface.dropTable('TaskTags');

export const up = (queryInterface, Sequelize) => queryInterface.createTable('TaskStatuses', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
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
export const down = (queryInterface, Sequelize) => queryInterface.dropTable('TaskStatuses');

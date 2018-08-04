const up = (queryInterface, Sequelize) => queryInterface.createTable('tasks', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  creatorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  assignedToId: {
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

const down = (queryInterface, Sequelize) => queryInterface.dropTable('Tasks');

export { up, down };

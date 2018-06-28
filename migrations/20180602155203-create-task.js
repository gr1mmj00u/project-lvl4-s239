const up = (queryInterface, Sequelize) => queryInterface.createTable('Tasks', {
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
  creator: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  assignedTo: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  // tags: {

  // },
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

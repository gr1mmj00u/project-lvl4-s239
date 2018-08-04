export const up = (queryInterface, Sequelize) =>
  queryInterface.bulkInsert(
    'taskStatuses',
    [
      {
        id: 1,
        name: 'New',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        id: 2,
        name: 'Working',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        id: 3,
        name: 'Testing',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        id: 4,
        name: 'Сompleted',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {},
  );

export const down = (queryInterface, Sequelize) => queryInterface.bulkDelete('taskStatuses', null, {});

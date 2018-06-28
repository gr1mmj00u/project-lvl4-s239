// test/truncate.js
import map from 'lodash/map';
import models from '../../models';

export default async () => Promise.all(map(Object.keys(models), key => ((['sequelize', 'Sequelize'].includes(key))
  ? null
  : models[key].destroy({ where: {}, force: true }))));

// __test__/helpers/factories/user.js
import faker from 'faker';
import models from '../../../models';

/**
 * Generate an object which container attributes needed
 * to successfully create a user instance.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       An object to build the user from.
 */
export const fakeUserData = async (props = {}) => {
  const defaultProps = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
  };
  return Object.assign({}, defaultProps, props);
};

/**
 * Generates a user instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       A user instance
 */
export default async (props = {}) =>
  models.user.create(await fakeUserData(props));

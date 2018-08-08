import request from 'supertest';
import matchers from 'jest-supertest-matchers';

import app from '..';
import db, { user as User } from '../models';
import { encrypt } from '../lib/secure';

import userFactory, { fakeUserData } from './helpers/factories/user';
import truncate from './helpers/truncate';

const createAuthenticatedRequest = async (myserver, loginDetails, done) => {
  const authenticatedRequest = request.agent(myserver);

  // const response = await authenticatedRequest.post('/sessions')
  //   .send({ form: loginDetails })
  //   .then(async (res) => {
  //   })
  //   .catch(async (err) => {
  //     blomp = await done(authenticatedRequest);
  //   });
  const as = authenticatedRequest.post('/sessions')
    .send({ form: loginDetails })
    .then((res) => {
      console.log(res);
      done(authenticatedRequest);
    });
  return as;
  // .end(() => done(authenticatedRequest));
};

describe('requests', () => {
  let server;

  // const testUser = {
  //   form: {
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     email: 'test@test.com',
  //     password: 'test',
  //   },
  // };

  beforeAll(async () => {
    jasmine.addMatchers(matchers);
    await db.sequelize.sync();
  });

  beforeEach(async () => {
    server = app().listen(3001);

    await truncate();
  });

  // it('Create user', async () => {
  //   const testUser = await fakeUserData();

  //   const res = await request.agent(server)
  //     .post('/users')
  //     .type('form')
  //     .send({ form: testUser });

  //   expect(res).toHaveHTTPStatus(302);

  //   const user = await User.findById(1);

  //   expect(user).toMatchObject({
  //     firstName: testUser.firstName,
  //     lastName: testUser.lastName,
  //     email: testUser.email,
  //     passwordDigest: encrypt(testUser.password),
  //   });
  // });

  // it('Authorization user', async () => {
  //   const testUser = await userFactory();

  //   const getUserPage = async (req) => {
  //     const res = await req.get('/users');
  //     return res;
  //   };

  //   const res = await createAuthenticatedRequest(server, testUser, getUserPage);

  //   expect(res).toHaveHTTPStatus(302);
  // });

  it('Update user', async () => {
    const testUser = await userFactory();
    const newDataUser = {
      firstName: 'TestTest',
      lastName: 'TestTest',
    };

    const userExpected = await User.findById(testUser.id);

    const updateUser = async (req) => {
      const res = await req.put(`/users/${testUser.id}`)
        .type('form')
        .send({ form: newDataUser });

      return res;
    };

    const res = await createAuthenticatedRequest(server, testUser, updateUser);
    console.log(res);
    expect(res).toHaveHTTPStatus(302);

    expect(userExpected).toMatchObject({
      firstName: newDataUser.firstName,
      lastName: newDataUser.lastName,
      email: testUser.email,
      passwordDigest: encrypt(testUser.password),
    });
  });

  // it('Create task', async () => {
  //   const testTask = {
  //     form: {
  //       name: 'name task',
  //       description: 'description',
  //       assignedTo: 2,
  //     };


  //   };
  // });

  afterEach(() => {
    server.close();
    // db.sequelize.close();
  });

  afterAll(() => {
    db.sequelize.close();
  });
});

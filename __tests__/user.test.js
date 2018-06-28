import request from 'supertest';
import matchers from 'jest-supertest-matchers';

import app from '..';
import db, { User } from '../models';
import { encrypt } from '../lib/secure';

import userFactory from './helpers/factories/user';
import truncate from './helpers/truncate';

const createAuthenticatedRequest = async (myserver, loginDetails, done) => {
  const authenticatedRequest = request.agent(myserver);
  authenticatedRequest.post('/session')
    .send(loginDetails)
    .end((error, response) => {
      console.log('awdawd');
      if (error) {
        throw error;
      }
      const loginCookie = response.headers['set-cookie'];
      done(loginCookie);
    });

  // const resp = await authenticatedRequest.post('/session')
  //   .type('form')
  //   .send(loginDetails)
  //   .end(() => done(authenticatedRequest));
  //   // .then(async () => done(authenticatedRequest));
  // // const res = await done(resp);
  // return resp;
  // .end(() => done(authenticatedRequest));
};

describe('requests', () => {
  let server;

  const testUser = {
    form: {
      firstName: 'Test',
      lastName: 'Test',
      email: 'test@test.com',
      password: 'test',
    },
  };

  beforeAll(async () => {
    jasmine.addMatchers(matchers);
    await db.sequelize.sync();
    // const testUser = new User();
  });

  beforeEach(async () => {
    server = app().listen(3001);
    // db.sequelize.sync({
    //   force: true,
    // });
    // const trunc = async () => (await truncate())();
    await truncate();
  });

  it('Create user', async () => {
    const res = await request.agent(server)
      .post('/user')
      .type('form')
      .send(testUser);

    expect(res).toHaveHTTPStatus(302);

    const user = await User.findById(1);

    expect(user).toMatchObject({
      firstName: testUser.form.firstName,
      lastName: testUser.form.lastName,
      email: testUser.form.email,
      passwordDigest: encrypt(testUser.form.password),
    });
  });

  // it('Authorization user', async () => {
  //   await userFactory(testUser.form);

  //   const getUserPage = async (req) => {
  //     const res = await req.get('/user');
  //     return res;
  //   };

  //   const res = await createAuthenticatedRequest(server, testUser, getUserPage);

  //   expect(res).toHaveHTTPStatus(302);
  // });

  it('Update user', async () => {
    const user = await userFactory(testUser.form);
    const newDataUser = {
      form: {
        firstName: 'TestTest',
        lastName: 'TestTest',
      },
    };

    const res1 = await request.agent(server)
      .post('/session')
      .send(testUser);

    console.log(res1.headers['set-cookie']);
    const res2 = await request.agent(server)
      .put('/user')
      .set('cookie', res1.headers['set-cookie'])
      .type('form')
      .send(newDataUser);

    expect(res2).toHaveHTTPStatus(302);

    const userExpected = await User.findById(user.id);

    expect(userExpected).toMatchObject({
      awd: newDataUser.form.firstName,
      lastName: newDataUser.form.lastName,
      email: testUser.form.email,
      passwordDigest: encrypt(testUser.form.password),
    });

    // const authenticatedRequest = request.agent(server);

    // const resp = await authenticatedRequest.post('/session')
    //   .type('form')
    //   .send(newDataUser)
    //   .then(res => authenticatedRequest.put('/user')
    //     .type('form')
    //     .send(newDataUser)
    //     .then((response) => {
    //       expect(response).toHaveHTTPStatus(302);
    //       // const userExpected = await User.findById(user.id);
    //       // console.log('awdawd');
    //       // expect(userExpected).toMatchObject({
    //       //   awd: newDataUser.form.firstName,
    //       //   lastName: newDataUser.form.lastName,
    //       //   email: testUser.form.email,
    //       //   passwordDigest: encrypt(testUser.form.password),
    //       // });
    //     }) );

    // .then(async () => done(authenticatedRequest));
    // const res = await done(resp);
    // return resp;

    // const put = async (cookie) => {
    //   await request.agent(server).put('/user')
    //     .type('form')
    //     .set('cookie', cookie)
    //     .send(newDataUser)
    //     .end(async (response) => {
    //       console.log(response);
    //       expect(response).toHaveHTTPStatus(302);
    //       const userExpected = await User.findById(user.id);

    //       expect(userExpected).toMatchObject({
    //         awd: newDataUser.form.firstName,
    //         lastName: newDataUser.form.lastName,
    //         email: testUser.form.email,
    //         passwordDigest: encrypt(testUser.form.password),
    //       });
    //     })
    //     .catch(e => console.log(e));
    // };

    // await createAuthenticatedRequest(server, testUser, put);
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

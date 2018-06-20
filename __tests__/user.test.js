import request from 'supertest';
import matchers from 'jest-supertest-matchers';

import app from '..';
import db, { User } from '../models';
import { encrypt } from '../lib/secure';

const createAuthenticatedRequest = async (myserver, loginDetails, done) => {
  const authenticatedRequest = request.agent(myserver);

  return authenticatedRequest.post('/session')
    .send(loginDetails)
    .end(() => done(authenticatedRequest));
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

  beforeAll(() => {
    jasmine.addMatchers(matchers);
    db.sequelize.sync();
  });

  beforeEach(() => {
    server = app().listen(3001);
  });

  it('GET 200', async () => {
    const res = await request.agent(server)
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET 404', async () => {
    const res = await request.agent(server)
      .get('/wrong-path');
    expect(res).toHaveHTTPStatus(404);
  });

  it('Users list page', async () => {
    const res = await request.agent(server)
      .get('/users');
    expect(res).toHaveHTTPStatus(200);
  });

  it('Sign in page', async () => {
    const res = await request.agent(server)
      .get('/session/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('Sign up page', async () => {
    const res = await request.agent(server)
      .get('/user/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('Create user', async () => {
    const res = await request.agent(server)
      .post('/user')
      .type('form')
      .send(testUser);

    expect(res).toHaveHTTPStatus(302);

    const user = await User.findById(1);

    expect(user).toBeInstanceOf(User);
    expect(user.firstName).toBe(testUser.form.firstName);
    expect(user.lastName).toBe(testUser.form.lastName);
    expect(user.email).toBe(testUser.form.email);
    expect(user.passwordDigest).toBe(encrypt(testUser.form.password));
  });

  it('Authorization user', async () => {
    const getUserPage = async (req) => {
      const res = await req.get('/user');
      return res;
    };

    const res = await createAuthenticatedRequest(server, testUser, getUserPage);

    expect(res).toHaveHTTPStatus(302);
  });

  it('Update user', async () => {
    const newDataUser = {
      form: {
        firstName: 'TestTest',
        lastName: 'TestTest',
      },
    };

    const put = async (req) => {
      const res = await req.put('/user')
        .type('form')
        .send(newDataUser);

      return res;
    };

    const res = await createAuthenticatedRequest(server, testUser, put);

    const user = await User.findById(1);
    expect(user.firstName).toBe('TestTest');
    expect(user.lastName).toBe('TestTest');
    expect(res).toHaveHTTPStatus(302);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});

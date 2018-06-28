import request from 'supertest';
import matchers from 'jest-supertest-matchers';

import app from '..';
import db from '../models';

import truncate from './helpers/truncate';


describe('requests', () => {
  let server;

  beforeAll(async () => {
    jasmine.addMatchers(matchers);
    await db.sequelize.sync();
    // const testUser = new User();
  });

  beforeEach(async () => {
    server = app().listen(3001);
    // await db.sequelize.sync({
    //   force: true,
    // });
    // const trunc = async () => (await truncate())();
    await truncate();
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

  afterEach(() => {
    server.close();
  });

  afterAll(() => {
    db.sequelize.close();
  });
});

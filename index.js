import 'babel-polyfill';
import Koa from 'koa';
import koaLogger from 'koa-logger';
import serve from 'koa-static';
import Pug from 'koa-pug';
import Router from 'koa-router';
import middleware from 'koa-webpack';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import flash from 'koa-flash-simple';
import methodOverride from 'koa-methodoverride';

import path from 'path';
import Rollbar from 'rollbar';
import _ from 'lodash';
import webpackConfig from './webpack.config.babel';
import addRoutes from './routes';
import container from './container';
import { authUser } from './lib/user';

export default () => {
  const app = new Koa();

  // ERROR
  app.use(async (ctx, next) => {
    try {
      await next();

      const status = ctx.status || 404;
      if (status === 404) {
        ctx.throw(404);
      }
    } catch (err) {
      // Errors handling using Rollbar
      if (process.env.RollbarApiKey) {
        const rollbar = new Rollbar(process.env.RollbarApiKey);
        rollbar.error(err, ctx.request);
      }
      // Set status on ctx
      ctx.status = parseInt(err.status, 10) || ctx.status || 500;
      // Build response or do whatever you want depending on status
      switch (ctx.status) {
        case 400:
        case 401:
          ctx.render('errors/401');
          break;
        case 403:
        case 404:
          ctx.render('errors/404');
          break;
        default: {
          ctx.body = { message: 'Unknown error' };
        }
      }
    }
  });

  // LOGGER
  app.use(koaLogger());

  // SESSION
  app.use(session(app));

  // FLASH
  app.keys = ['some secret hurr'];
  app.use(flash());
  app.use(async (ctx, next) => {
    ctx.state = {
      flash: ctx.flash,
      isSignedIn: () => ctx.session.userId !== undefined,
    };
    await next();
  });

  // ADD USER IN STATE
  app.use(authUser);

  // BODYPARSER
  app.use(bodyParser({
    strict: false,
  }));

  // OVERRIDE
  app.use(methodOverride((req) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      return req.body._method; // eslint-disable-line
    }
    return null;
  }));

  // STATIC
  app.use(serve(process.cwd()));

  // WEBPACK
  if (process.env.NODE_ENV !== 'production') {
    app.use(middleware({
      config: webpackConfig,
    }));
  }

  // ROUTING
  const router = new Router();
  addRoutes(router, container);
  app.use(router.routes());
  app.use(router.allowedMethods());

  // RESPONSE
  const pug = new Pug({
    viewPath: path.join(__dirname, 'views'),
    noCache: process.env.NODE_ENV === 'development',
    debug: true,
    pretty: true,
    compileDebug: true,
    locals: [],
    basedir: path.join(__dirname, 'views'),
    helperPath: [
      { _ },
      { urlFor: (...args) => router.url(...args) },
    ],
  });

  pug.use(app);

  return app;
};

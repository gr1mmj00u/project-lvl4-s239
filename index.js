import 'babel-polyfill';
import Koa from 'koa';
import Rollbar from 'rollbar';

export default () => {
  const app = new Koa();

  if (process.env.RollbarApiKey) {
    const rollbar = new Rollbar(process.env.RollbarApiKey);
    // Errors handling using Rollbar as first middleware to catch exception
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        rollbar.error(err, ctx.request);
      }
    });
  }

  // response
  app.use((ctx) => {
    ctx.body = 'Hello Koa project';
  });

  return app;
};

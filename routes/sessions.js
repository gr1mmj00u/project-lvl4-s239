import buildFormObj from '../lib/formObjectBuilder';
import { encrypt } from '../lib/secure';
import { User } from '../models';

export default (router) => {
  router
    .get('newSession', '/session/new', async (ctx) => {
      const data = {};
      ctx.render('sessions/new', { f: buildFormObj(data) });
    })
    .post('session', '/session', async (ctx) => {
      const { email, password } = ctx.request.body.form;
      const errors = [];

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        errors.push({
          message: 'User with such email does not exist',
          path: 'email',
        });
      }

      if (user && user.passwordDigest !== encrypt(password)) {
        errors.push({
          message: 'Password were wrong',
          path: 'password',
        });
      }

      if (errors.length) {
        ctx.render('sessions/new', { f: buildFormObj({ email }, { errors }) });
        return;
      }

      ctx.session.userId = user.id;
      ctx.flash.set('Hello my friend!');
      ctx.redirect(router.url('root'));
    })
    .del('session', '/session', (ctx) => {
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};


import buildFormObj from '../lib/formObjectBuilder';
import { encrypt } from '../lib/secure';
import { user as User } from '../models';

export default (router) => {
  router
    .get('sessions new', '/sessions/new', async (ctx) => {
      const data = {};
      ctx.render('sessions/new', { f: buildFormObj(data) });
    })
    .post('sessions post', '/sessions', async (ctx) => {
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
      ctx.flash.setSuccessAlert('Hello my friend!');
      ctx.redirect(router.url('root'));
    })
    .del('sessions delete', '/sessions', (ctx) => {
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};


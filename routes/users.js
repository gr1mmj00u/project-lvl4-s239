import buildFormObj from '../lib/formObjectBuilder';
import { User } from '../models';
import { requiredAuth } from '../lib/user';

export default (router) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users/index', { users });
    })
    .get('newUser', '/user/new', async (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .get('user', '/user', requiredAuth, async (ctx) => {
      const user = await User.findById(ctx.session.userId);
      ctx.render('users/edit', { f: buildFormObj(user) });
    })
    .post('user', '/user', async (ctx) => {
      const { request: { body: { form } } } = ctx;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })
    .put('users', '/user', requiredAuth, async (ctx) => {
      const { request: { body: { form } } } = ctx;
      try {
        const user = await User.findById(ctx.session.userId);
        await user.update(form);
        ctx.flash.set('User has been updated');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.flash.set(e.message);
      }
      ctx.redirect(router.url('user'));
    })
    .delete('user', '/user', async (ctx) => {
      try {
        const user = await User.findById(ctx.session.userId);
        await user.destroy();
        ctx.flash.set('User has been deleted');
        ctx.session = {};
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.flash.set(e.message);
        ctx.redirect(router.url('user'));
      }
    });
};

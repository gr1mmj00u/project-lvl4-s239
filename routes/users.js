import buildFormObj from '../lib/formObjectBuilder';
import { user as User } from '../models';
import { requiredAuth } from '../lib/user';

export default (router) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users/index', { users });
    })
    .get('new user', '/users/new', async (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .get('user edit', '/users/:id/edit', requiredAuth, async (ctx) => {
      const user = await User.findById(ctx.params.id);
      if (user.id !== ctx.session.userId) {
        ctx.status = 403;
        ctx.throw(403, 'Forbidden');
      }
      ctx.render('users/edit', { f: buildFormObj(user) });
    })
    .post('users post', '/users', async (ctx) => {
      const { request: { body: { form } } } = ctx;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.setSuccessAlert('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.flash.setDangerAlert('User was not created');
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })
    .put('users put', '/users/:id', requiredAuth, async (ctx) => {
      const { request: { body: { form } } } = ctx;
      const user = await User.findById(ctx.params.id);
      if (user.id !== ctx.session.userId) {
        ctx.status = 403;
        ctx.throw(403, 'Forbidden');
      }
      try {
        await user.update(form);
        ctx.flash.setSuccessAlert('User has been updated');
        ctx.redirect(router.url('user edit', { id: ctx.params.id }));
      } catch (e) {
        ctx.flash.setDangerAlert('User was not updated');
        ctx.render('users/edit', { f: buildFormObj(user, e) });
      }
    })
    .delete('users delete', '/users/:id', async (ctx) => {
      const user = await User.findById(ctx.params.id);
      if (user.id !== ctx.session.userId) {
        ctx.status = 403;
        ctx.throw(403, 'Forbidden');
      }
      try {
        await user.destroy();
        ctx.session = {};
        ctx.flash.setSuccessAlert('User has been deleted');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.flash.setDangerAlert(e.message);
        ctx.redirect(router.url('user edit', { id: ctx.params.id }));
      }
    });
};

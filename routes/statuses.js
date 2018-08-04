import buildFormObj from '../lib/formObjectBuilder';
import { taskStatus as TaskStatus } from '../models';
import { requiredAuth } from '../lib/user';

export default (router) => {
  router
    .get('statuses', '/statuses', async (ctx) => {
      const statuses = await TaskStatus.findAll();
      ctx.render('statuses/index', { statuses });
    })
    .get('new status', '/statuses/new', requiredAuth, async (ctx) => {
      const status = TaskStatus.build();
      ctx.render('statuses/new', { f: buildFormObj(status) });
    })
    .get('edit status', '/statuses/:id/edit', requiredAuth, async (ctx) => {
      const { id } = ctx.params;
      try {
        const status = await TaskStatus.findById(id);

        ctx.render('statuses/edit', { status, f: buildFormObj(status) });
      } catch (e) {
        ctx.flash.setDangerAlert(e.message);
        ctx.redirect(router.url('statuses'));
      }
    })
    .post('status post', '/statuses', requiredAuth, async (ctx) => {
      const { request: { body: { form } } } = ctx;
      const status = TaskStatus.build(form);
      try {
        await status.save();
        ctx.flash.set('Status has been created');
        ctx.redirect(router.url('statuses'));
      } catch (e) {
        ctx.render('statuses/new', { f: buildFormObj(status, e) });
      }
    })
    .put('update status', '/statuses/:id', requiredAuth, async (ctx) => {
      const { id } = ctx.params;
      const { request: { body: { form } } } = ctx;
      try {
        const status = await TaskStatus.findById(id);

        if (!status) {
          ctx.throw(404);
        }

        await status.update(form);

        ctx.flash.setSuccessAlert('Status has been updated');
      } catch (e) {
        ctx.flash.setDangerAlert(e.message);
      }
      ctx.redirect(router.url('statuses'));
    })
    .delete('delete status', '/statuses/:id', requiredAuth, async (ctx) => {
      try {
        const { id } = ctx.params;
        const status = await TaskStatus.findById(id);

        if (!status) {
          ctx.throw(404);
        }

        await status.destroy();

        ctx.flash.set('Status has been deleted');
      } catch (e) {
        ctx.flash.set(e.message);
      }
      ctx.redirect(router.url('statuses'));
    });
};

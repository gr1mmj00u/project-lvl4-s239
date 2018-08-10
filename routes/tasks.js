import Sequelize from 'sequelize';
import buildFormObj from '../lib/formObjectBuilder';
import { task as Task, user as User, tag as Tag, taskStatus as TaskStatus } from '../models';
import { requiredAuth, getOptionsArray as getUsersOptionsArray } from '../lib/user';
import { parseToTags, createUniqTags } from '../lib/tags';

const { Op } = Sequelize;

export default (router) => {
  router
    .get('tasks', '/tasks', requiredAuth, async (ctx) => {
      const {
        status, tags, assignedTo: assignedToId, myTasks,
      } = ctx.query;

      const { userId } = ctx.session;
      const scope = [];

      if (myTasks !== undefined) {
        scope.push({ method: ['creatorTasks', userId] });
      }

      if (assignedToId && Number(assignedToId) !== 0) {
        scope.push({ method: ['creatorTasks', Number(assignedToId)] });
      }

      if (status && Number(status) !== 0) {
        scope.push({ method: ['tasksByStatus', Number(status)] });
      }
      const tagsArray = parseToTags(tags);

      if (tagsArray.length) {
        scope.push({ method: ['hasTag', tagsArray] });
      }

      const tasks = await Task.scope(scope).findAll({ include: [{ all: true, nested: true }] });

      const users = await User.findAll();
      const statuses = await TaskStatus.findAll();

      const statusOptions = statuses.reduce(
        (acc, st) => [...acc, { id: st.id, name: st.name }],
        [{ id: 0, name: 'any' }],
      ).map(s => (s.id === Number(status) ? { ...s, selected: true } : s));

      const usersOptions = [{ id: 0, name: 'any' }, ...getUsersOptionsArray(users)]
        .map(u => (u.id === Number(assignedToId) ? { ...u, selected: true } : u));

      const form = buildFormObj({
        tags, myTasks,
      });

      form.name = '';

      ctx.render('tasks', {
        statusOptions,
        usersOptions,
        f: form,
        tasks: tasks || [],
      });
    })
    .get('new task', '/tasks/new', requiredAuth, async (ctx) => {
      const users = await User.findAll();
      const usersOptions = getUsersOptionsArray(users);
      const task = Task.build();

      ctx.render('tasks/new', { usersOptions, f: buildFormObj(task) });
    })
    .get('edit task', '/tasks/:id/edit', requiredAuth, async (ctx) => {
      const { id } = ctx.params;
      try {
        const task = await Task.findById(id, {
          include: [{
            model: Tag,
            as: 'tags',
          }],
        });
        const users = await User.findAll();
        const status = await TaskStatus.findAll();

        const selectedTags = task.tags.map(tag => tag.name).join(', ');

        const statusOptions = status.map(st => ({ id: st.id, name: st.name }))
          .map(s => (s.id === task.status ? { ...s, selected: true } : s));

        const usersOptions = getUsersOptionsArray(users)
          .map(u => (u.id === task.assignedToId ? { ...u, selected: true } : u));

        ctx.render('tasks/edit', {
          statusOptions, usersOptions, selectedTags, task, f: buildFormObj(task),
        });
      } catch (e) {
        ctx.flash.setDangerAlert(e.message);
        ctx.redirect(router.url('tasks'));
      }
    })
    .post('create task', '/tasks', requiredAuth, async (ctx) => {
      const user = await User.findById(ctx.session.userId);
      const { request: { body: { form } } } = ctx;

      try {
        const task = await user.createTask(form);
        const tagsArray = parseToTags(form.tags);

        const tags = await createUniqTags(tagsArray);
        await task.setTags(tags);

        ctx.flash.setSuccessAlert('Task has been created');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        const users = await User.findAll();
        const usersOptions = getUsersOptionsArray(users);

        ctx.flash.setDangerAlert('Task was not created');
        ctx.render('tasks/new', { usersOptions, f: buildFormObj(form, e) });
      }
    })
    .put('update task', '/tasks/:id', requiredAuth, async (ctx) => {
      const { id } = ctx.params;
      const { request: { body: { form } } } = ctx;
      try {
        const task = await Task.findById(id);

        if (!task) {
          ctx.throw(404);
        }

        await task.update(form);
        const tagsArray = parseToTags(form.tags);

        const tags = await createUniqTags(tagsArray);
        await task.setTags(tags);

        ctx.flash.setSuccessAlert('Task has been updated');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        ctx.flash.setDangerAlert(e.message);
      }
      ctx.redirect(router.url('tasks'));
    })
    .delete('delete task', '/task/:id', requiredAuth, async (ctx) => {
      const { id } = ctx.params;
      try {
        const task = await Task.findById(id);

        if (!task) {
          ctx.throw(404);
        }

        await task.destroy();

        ctx.flash.setSuccessAlert('Task has been deleted');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        ctx.flash.setDangerAlert(e.message);
        ctx.redirect(router.url('edit task', { id }));
      }
    });
};

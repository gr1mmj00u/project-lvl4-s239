import buildFormObj from '../lib/formObjectBuilder';
import { Task, User, Tag, TaskStatus } from '../models';
import { requiredAuth, getOptionsArray as getUsersOptionsArray } from '../lib/user';
import { getOptionsArray as getTagsOptionsArray } from '../lib/tags';

export default (router) => {
  router
    .get('tasks', '/tasks', async (ctx) => {
      const tasks = await Task.findAll({
        include: [
          { model: User, as: 'Worker' }, // load all pictures
          { model: User, as: 'Creator' }, // load the profile picture.
          { model: TaskStatus, as: 'Status' },
          { model: Tag },
        ],
      });

      ctx.render('tasks', { tasks: tasks || [] });
    })
    .get('newTask', '/newtask', requiredAuth, async (ctx) => {
      const users = await User.findAll();
      const tags = await Tag.findAll();
      const usersOptions = getUsersOptionsArray(users);
      const tagsOptions = getTagsOptionsArray(tags);
      const task = Task.build();

      ctx.render('tasks/new', { tagsOptions, usersOptions, f: buildFormObj(task) });
    })
    .get('edit task', '/task/:id', requiredAuth, async (ctx) => {
      const taskId = ctx.params.id;
      try {
        const task = await Task.findById(taskId);

        const users = await User.findAll();
        const tags = await Tag.findAll();
        const status = await TaskStatus.findAll();

        const statusOptions = status.map(st => ({ id: st.id, name: st.name }));
        const usersOptions = getUsersOptionsArray(users);
        const tagsOptions = getTagsOptionsArray(tags);
        ctx.render('tasks/edit', {
          statusOptions, usersOptions, tagsOptions, task, f: buildFormObj(task),
        });
      } catch (e) {
        ctx.flash.set('Internal error');
        ctx.redirect(router.url('tasks'));
      }
    })
    .post('create task', '/task', requiredAuth, async (ctx) => {
      const user = await User.findById(ctx.session.userId);
      const { request: { body: { form } } } = ctx;

      try {
        const task = await user.createTask(form);
        await task.addTags(form.tags);

        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        const users = await User.findAll();
        const usersOptions = getUsersOptionsArray(users);
        ctx.render('tasks/new', { usersOptions, f: buildFormObj(form, e) });
      }
    })
    .put('update task', '/tasks/:id', requiredAuth, async (ctx) => {
      const { request: { body: { form } } } = ctx;
      try {
        const user = await User.findById(ctx.session.userId);
        await user.update(form);
        ctx.flash.set('Task has been updated');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        ctx.flash.set(e.message);
      }
      ctx.redirect(router.url('tasks'));
    })
    .delete('delete task', '/task/:id', async (ctx) => {
      try {
        const taskId = ctx.params.id;
        const task = await Task.findById(taskId);
        await task.destroy();
        ctx.flash.set('Task has been deleted');
        ctx.session = {};
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        ctx.flash.set(e.message);
        ctx.redirect(router.url('tasks'));
      }
    });
};

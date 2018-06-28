import buildFormObj from '../lib/formObjectBuilder';
import { Tag } from '../models';
import { requiredAuth } from '../lib/user';

export default (router) => {
  router
    .get('tags', '/tags', async (ctx) => {
      const tags = await Tag.findAll();
      ctx.render('tags/index', { tags });
    })
    .get('newTag', '/tag/new', requiredAuth, async (ctx) => {
      const tag = Tag.build();
      ctx.render('tags/new', { f: buildFormObj(tag) });
    })
    .post('tag', '/tag', requiredAuth, async (ctx) => {
      const { request: { body: { form } } } = ctx;
      const tag = Tag.build(form);
      try {
        await tag.save();
        ctx.flash.set('Tag has been created');
        ctx.redirect(router.url('tags'));
      } catch (e) {
        ctx.render('tags/new', { f: buildFormObj(tag, e) });
      }
    });
};

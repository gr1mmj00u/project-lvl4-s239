import { user as User } from '../models';

export const requiredAuth = async (ctx, next) => {
  if (ctx.session.userId === undefined) {
    ctx.status = 401;
    ctx.throw(401, 'Unauthorized');
  }
  await next();
};

export const authUser = async (ctx, next) => {
  const user = ctx.session.userId ? await User.findById(ctx.session.userId) : undefined;

  if (user) {
    ctx.state.user = user;
  }

  await next();
};

export const requiredUserAccess = async (ctx, next) => {
  const { id } = ctx.params;
  const user = await User.findById(id);
  if (user.id !== ctx.session.userId) {
    ctx.status = 403;
    ctx.throw(403, 'Forbidden');
  }
  await next();
};

export const getOptionsArray = (users = []) =>
  users.map(user => ({ id: user.id, name: user.fullName() }));

import { User } from '../models';

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

export const getOptionsArray = (users = []) =>
  users.map(user => ({ id: user.id, name: `${user.firstName} ${user.lastName}` }));

import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import tasks from './tasks';
import tags from './tags';

const controllers = [welcome, users, sessions, tasks, tags];

export default (router, container) => controllers.forEach(f => f(router, container));

# cross-task-manager

https://calm-spire-66207.herokuapp.com

## Open in web
localhost:3000

## Start server
```make install```

Set the environment variable in .env file (```NODE_ENV=development``` or ```NODE_ENV=production```)

```make db-setup```

## Tests
```make test```

## Helpers links

Sequelize:
https://github.com/sequelize/express-example
https://gist.github.com/andrewmunro/030f0bf62453239c495b0347c8cd1247
https://github.com/sequelize/sequelize/issues/4728

```node_modules/.bin/sequelize db:seed:all```

CRUD:
https://lorenstewart.me/2016/10/03/sequelize-crud-101/

Sqlite:
https://www.sqlite.org/cli.html

Check port:
```netstat -tulpn | grep :3000```

```"test": "npm run sequelize db:migrate && jest --runInBand", /* --detectOpenHandles */```

```sudo sysctl fs.inotify.max_user_watches=582222 && sudo sysctl -p```

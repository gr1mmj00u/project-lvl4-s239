install:
	npm install
publish:
	npm publish
lint:
	npm run eslint .
build:
	npm run build
test:
	NODE_ENV="test" npm test

prepare:
	touch .bash_history
	touch .env

start:
	DEBUG="application:*" npm run nodemon -- --watch .  --ext '.js' --exec npm run gulp -- server

console:
	npm run gulp console

db-setup:
	rm db.development.sqlite && npm run sequelize db:migrate && npm run sequelize db:seed:all
db-seeds:
	npm run sequelize db:seed:all

.PHONY: test

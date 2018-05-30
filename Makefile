install:
	npm install
publish:
	npm publish
lint:
	npm run eslint .
build:
	npm run build
test:
	npm test

prepare:
	touch .bash_history
	touch .env

start:
	DEBUG="application:*" npm run nodemon -- --watch .  --ext '.js' --exec npm run gulp -- server

.PHONY: test

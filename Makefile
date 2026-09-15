NPM ?= npm
NPX ?= npx

.PHONY: build install clean lint test-e2e test-e2e-debug

install:
	$(NPM) install

build: install
	$(NPM) run build

clean:
	$(NPM) run clean

lint:
	$(NPM) run lint

test-e2e:
	$(NPX) playwright test

test-e2e-debug:
	$(NPX) playwright test --ui

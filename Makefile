
TESTS = test/*.js
REPORTER = list

#
# Tests
# 

test: test-node test-browser

test-node: 
	@printf "\n  ==> [Node.js]"
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require ./test/bootstrap \
		--reporter $(REPORTER) \
		$(TESTS)

test-browser: build
	@printf "\n  ==> [Karma]\n\n"
	@./node_modules/.bin/karma start \
		--single-run

test-cov: lib-cov
	@eql_COV=1 NODE_ENV=test ./node_modules/.bin/mocha \
		--require ./test/bootstrap \
		--reporter html-cov \
		$(TESTS) \
		> coverage.html

test-travisci: test-node test-browser lib-cov
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@eql_COV=1 NODE_ENV=test ./node_modules/.bin/mocha \
		--require ./test/bootstrap \
		--reporter mocha-lcov-reporter \
		$(TESTS) \
		| ./node_modules/coveralls/bin/coveralls.js

#
# Components
# 

build: components lib/*
	@./node_modules/.bin/component-build --dev

components: component.json
	@./node_modules/.bin/component-install --dev

#
# Coverage
# 

lib-cov:
	@rm -rf lib-cov
	@./node_modules/.bin/jscoverage lib lib-cov

#
# Clean up
# 

clean: clean-components clean-cov

clean-components:
	@rm -rf build
	@rm -rf components

clean-cov:
	@rm -rf lib-cov
	@rm -f coverage.html


.PHONY: clean clean-components clean-cov 
.PHONY: test test-cov test-node test-browser test-travisci
.PHONY: lib-cov

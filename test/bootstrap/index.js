/*!
 * Attach chai to global should
 */

global.chai = require('chai');
global.should = global.chai.should();

/*!
 * Chai Plugins
 */

//global.chai.use(require('chai-spies'));
//global.chai.use(require('chai-http'));

/*!
 * Import project
 */

global.eql = require('../..');

/*!
 * Helper to load internals for cov unit tests
 */

function req (name) {
  return process.env.eql_COV
    ? require('../../lib-cov/eql/' + name)
    : require('../../lib/eql/' + name);
}

/*!
 * Load unexposed modules for unit tests
 */

global.__eql = {};

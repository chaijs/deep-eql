/*!
 * Assert
 */

global.assert = require('simple-assert');

/*!
 * Import project
 */

global.eql = process.env.eql_COV
  ? require('../../lib-cov/eql')
  : require('../../lib/eql');

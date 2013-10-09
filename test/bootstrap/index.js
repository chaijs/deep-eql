/*!
 * Assert
 */

global.assert = require('simple-assert');

/*!
 * Import project
 */

global.eql = process.env.type_COV
  ? require('../../lib-cov/eql')
  : require('../../lib/eql');

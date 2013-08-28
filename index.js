module.exports = process.env.eql_COV
  ? require('./lib-cov/eql')
  : require('./lib/eql');

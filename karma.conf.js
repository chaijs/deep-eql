'use strict';

/* eslint-disable no-process-env */

var packageJson = require('./package.json');
var defaultTimeout = 120000;
var browserifyIstanbul = require('browserify-istanbul');
module.exports = function configureKarma(config) {
  var localBrowsers = [ 'ChromeHeadless' ];
  var sauceLabsBrowsers = {
    SauceChromeLatest: {
      base: 'SauceLabs',
      browserName: 'Chrome',
    },
    SauceFirefoxLatest: {
      base: 'SauceLabs',
      browserName: 'Firefox',
    },
    SauceSafariLatest: {
      base: 'SauceLabs',
      browserName: 'Safari',
      platform: 'OS X 10.11',
    },
    SauceInternetExplorerLatest: {
      base: 'SauceLabs',
      browserName: 'Internet Explorer',
    },
    SauceInternetExplorerOldestSupported: {
      base: 'SauceLabs',
      browserName: 'Internet Explorer',
      version: 9,
    },
    SauceEdgeLatest: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
    },
    SauceAndroidLatest: {
      base: 'SauceLabs',
      browserName: 'Android',
    },
  };
  config.set({
    basePath: '',
    browsers: localBrowsers,
    logLevel: process.env.npm_config_debug ? config.LOG_DEBUG : config.LOG_INFO,
    frameworks: [ 'browserify', 'mocha' ],
    files: [ 'test/*.js' ],
    exclude: [],
    preprocessors: {
      'test/*.js': [ 'browserify' ],
    },
    browserify: {
      debug: true,
      bare: true,
      transform: [ browserifyIstanbul({ ignore: [ '**/node_modules/**', '**/test/**' ] }) ],
    },
    reporters: [ 'progress', 'coverage' ],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
    },
    port: 9876,
    colors: true,
    concurrency: 3,
    autoWatch: false,
    captureTimeout: defaultTimeout,
    browserDisconnectTimeout: defaultTimeout,
    browserNoActivityTimeout: defaultTimeout,
    singleRun: true,
  });

  if (process.env.SAUCE_ACCESS_KEY && process.env.SAUCE_USERNAME) {
    var branch = 'local';
    var build = 'localbuild';
    config.reporters.push('saucelabs');
    config.set({
      customLaunchers: sauceLabsBrowsers,
      browsers: localBrowsers.concat(Object.keys(sauceLabsBrowsers)),
      sauceLabs: {
        testName: packageJson.name,
        tunnelIdentifier: new Date().getTime(),
        recordVideo: true,
        startConnect: true,
        tags: [ 'typeDetect_' + packageJson.version, process.env.SAUCE_USERNAME + '@' + branch, build ],
      },
    });
  }
};

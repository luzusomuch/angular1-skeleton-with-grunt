'use strict';
const logger = require('pino')({
  name: process.env.APP_NAME,
  prettyPrint: 'true'
});
logger.level = process.env.LOG_LEVEL || 'debug';

const expressLogger = require('express-pino-logger')({
  logger: logger
});

logger.error = (function() {
  var cached_function = logger.error;
  return function() {
    var result = cached_function.apply(this, arguments);
    return result;
  };
})();

module.exports = {
  logger,
  expressLogger
};

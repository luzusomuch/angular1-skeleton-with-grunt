'use strict';

const http = require('http');
const express = require('express');
const kraken = require('kraken-js');
const nconf = require('nconf');
const path = require('path');
const Log = require('./lib/log');
const cors = require('cors');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);
var server = (module.exports = {});
global.Joi = Joi;
global.log = Log.logger;
global.nconf = nconf;
global.ObjectId = require('mongodb').ObjectID;
global.moment = require('moment');
server.start = function(callback) {
  let options;
  // Setup global utils
  nconf
    .argv()
    .env('__')
    .file('mainConfig', path.resolve(process.cwd(), './config/' + process.env.NODE_ENV + '.json'));
  global.Constants = require('./constants');
  global.Services = require('./services');
  global.Middlewares = require('./middlewares');

  let app = express();
  app.use(express.static('apidoc'));
  let httpServer = http.createServer(app);

  options = {
    onconfig: async (config, next) => {
      try {
        await require('./lib/mongoose')(app, config);
        next(null, config);
      } catch (err) {
        log.error(err);
      }
    }
  };
  app.use(kraken(options));
  app.use('/api/*', Middlewares.Policy.is.authenticated);
  app.use(Log.expressLogger);
  var whitelist = nconf.get('appConfig:whitelist') || '';
  var corsOptions = {
    origin: function(origin, callback) {
      if (whitelist.split(',').indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true
  };
  app.use(cors(corsOptions));
  callback =
    callback ||
    function() {
      app.use(Middlewares.ErrorHandler);
      log.info('Application ready to serve requests.');
      log.info('Environment: %s', app.kraken.get('env:env'));
      log.info('Server listening on http://localhost:%d', nconf.get('PORT'));
    };

  app.on('start', callback);

  var PORT = nconf.get('PORT');
  return httpServer.listen(PORT);
};

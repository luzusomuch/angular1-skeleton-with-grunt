'use strict';

const express = require('express');
const nconf = require('nconf');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

global.nconf = require('nconf');

nconf
  .file('mainConfig', path.resolve(process.cwd(), './config/test.json'))
  .file('messages', path.resolve(process.cwd(), './config/messages.json'));

global.Constants = require('../constants');
global.request = require('supertest')(app);
global.testUtil = require('./util')(global.request);
global.Joi = require('joi');
global.log = require('../lib/log').logger;
global.expect = require('chai').expect;
global.ObjectId = require('mongodb').ObjectID;
global.Services = require('./services');
global.Middlewares = require('../middlewares');
before(async() => {
  await require('../lib/mongoose')();
  // // remove collections
  await db.Account.remove({});
  app.use(require('kraken-js/middleware/multipart')({
    uploadDir: __dirname+ '/assets'
  }));  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use('/api/*', Middlewares.Policy.is.authenticated);
  app.use('/auth', testUtil.hookRoute(`${__dirname}/../controllers/auth`));
  app.use(Middlewares.ErrorHandler);
});
require('./controllers/AccountController');
require('./controllers/AuthenticationController');
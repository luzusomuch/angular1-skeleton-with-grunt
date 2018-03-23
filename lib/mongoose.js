const mongoose = require('mongoose');
const db = require('../models');
const nconf = require('nconf');
const MONGO_URI = nconf.get('MONGO_URI');
const MONGOOSE_RECONNECT_MS = 1000;

mongoose.Promise = global.Promise;

module.exports = () => {
  // mongoose.set('debug', process.env.MONGOOSE_DEBUG);
  // when the connection is connected
  mongoose.connection.on('connected', () => {
    log.info(`mongoose connection open to ${MONGO_URI}`);
  });

  // if the connection throws an error
  mongoose.connection.on('error', log.error);
  // when the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    log.info('mongoose disconnected');
  });

  // connect to mongodb
  global.mongoose = mongoose;
  return reconnect().then(() => Promise.resolve(mongoose));
};

const reconnect = () => {
  return mongoose.connect(MONGO_URI)
  .then(() => {
    global.db = db;
    return Promise.resolve();
  }).catch((err) => {
    log.error(err);
    log.info(`attempting to reconnect in (${MONGOOSE_RECONNECT_MS}) ms`);
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(reconnect());
      }, MONGOOSE_RECONNECT_MS);
    });
  });
};
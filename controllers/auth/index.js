'use strict';
const AuthController = require('./controller');

module.exports = function (router) {
  router.post('/login', AuthController.login);
  router.post('/register', AuthController.createPartner);
  router.post('/registerSdk', AuthController.createSdk);
};

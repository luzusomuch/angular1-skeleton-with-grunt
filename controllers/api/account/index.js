'use strict';
const AccountController = require('./controller');
module.exports = function (router) {
  router.get('/profile', AccountController.getProfile);
};

'use strict';
const AuthController = require('./controller');


module.exports = function (router) {
  router.post('/login', AuthController.login);
  router.get('/googleoauthurl', AuthController.getGoogleOAuthUrl);
  router.get('/googleoauth', AuthController.getGoogleOAuthToken);
  router.post('/register', AuthController.register);
  router.post('/verify/:token', AuthController.verify);
  router.post('/forgot', AuthController.forgot);
  router.post('/reset-password/:token', AuthController.resetPassword);
};

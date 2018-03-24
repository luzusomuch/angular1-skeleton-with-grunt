'use strict';
const ChallengeController = require('./controller');
module.exports = function (router) {
  router.post('/',
    ChallengeController.create
  );
};
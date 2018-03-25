'use strict';
const ChallengeController = require('./controller');
module.exports = function (router) {
  require('./submissions')(router);
  router.post('/',
    ChallengeController.create
  );
  router.get('/:challengeId',
    ChallengeController.findOne
  );
  router.post('/:challengeId/join',
    ChallengeController.join
  );
};
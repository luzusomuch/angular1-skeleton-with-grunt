'use strict';
const ChallengeController = require('./controller');
module.exports = function (router) {
  router.use('/:challengeId', Middlewares.Parsers.challenge);
  require('./submissions')(router);
  router.post('/',
    ChallengeController.create
  );
  router.get('/:challengeId',
    ChallengeController.findOne
  );
  router.get('/',
    ChallengeController.find
  );
  router.post('/:challengeId/join',
    ChallengeController.join
  );
};
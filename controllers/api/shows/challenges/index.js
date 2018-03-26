'use strict';
const ChallengeController = require('./controller');
module.exports = function (router) {
  router.use('/:showId/challenges/:challengeId', Middlewares.Parsers.challenge);
  router.post('/:showId/challenges',
    ChallengeController.create
  );
  router.get('/:showId/challenges/:challengeId',
    ChallengeController.findOne
  );
  router.get('/:showId/challenges/',
    ChallengeController.find
  );
  router.post('/:showId/challenges/:challengeId/join',
    ChallengeController.join
  );
};
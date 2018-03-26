'use strict';
const SubmissionController = require('./controller');
module.exports = function (router) {
  router.post('/:showId/challenges/:challengeId/submissions/:submissionId/like',
    SubmissionController.like
  );
  router.get('/:showId/challenges/:challengeId/submissions/:submissionId',
    SubmissionController.findOne
  );
  router.get('/:showId/challenges/:challengeId/submissions',
    SubmissionController.find
  );
};
'use strict';
const SubmissionController = require('./controller');
module.exports = function (router) {
  router.post('/:challengeId/submissions/:submissionId/like',
    SubmissionController.like
  );
  router.get('/:challengeId/submissions/:submissionId',
    SubmissionController.findOne
  );
  router.get('/:challengeId/submissions',
    SubmissionController.find
  );
};
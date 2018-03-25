'use strict';
const SubmissionController = {
 /**
   * @apiGroup Challenge
   * @apiVersion 1.0.0
   * @api {post} /api/challenges/:challengeId/submissions/:submissionId/like Like a submission
   * @apiDescription Like a submission. 
   * @apiParam {String}   challengeId           Id of the submission to be liked.
   * @apiParam {String}   submissionId          Id of the challenge to which the submission belongs.
   */
  like(req, res, next) {
    const options = Object.assign({}, req.params, req.body);
    return Services.Submission.like(options)
      .then(result => res.status(200).send(result))
      .catch(next);
  },
};
module.exports = SubmissionController;
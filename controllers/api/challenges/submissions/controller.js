'use strict';
const SubmissionController = {
 /**
   * @apiGroup Submission
   * @apiVersion 1.0.0
   * @api {post} /api/challenges/:challengeId/submissions/:submissionId/like Like a submission
   * @apiDescription Like a submission. 
   * @apiParam {String}   submissionId            Id of the submission to be liked.
   * @apiParam {String}   challengeId             Id of the challenge to which the submission belongs.
   */
  like(req, res, next) {
    const options = Object.assign({}, req.params, req.body);
    return Services.Submission.like(options)
      .then(result => res.status(200).send(result))
      .catch(next);
  },
  /**
   * @apiGroup Submission
   * @apiVersion 1.0.0
   * @api {get} /api/challenges/:challengeId/submissions/:submissionId Get a submission
   * @apiDescription Get a submission by its id. 
   * @apiParam {String}   submissionId            Id of the submission to be retrieved.
   * @apiParam {String}   challengeId             Id of the challenge to which the submission belongs.
   */
  findOne(req, res, next) {
    const options = Object.assign({}, req.params);
    return Services.Submission.findOne(options)
      .then(result => res.status(200).send(result))
      .catch(next);
  },
};
module.exports = SubmissionController;
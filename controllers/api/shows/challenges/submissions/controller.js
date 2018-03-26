'use strict';
const SubmissionController = {
 /**
   * @apiGroup Submission
   * @apiVersion 1.0.0
   * @api {post} /api/challenges/:challengeId/submissions/:submissionId/like Like a submission
   * @apiDescription Like a submission. 
   * @apiHeader {String}    Authorization       Authorization token
   * @apiHeaderExample {json} Example:
   *     {
   *       "Authorization": "Bearer abcxyz1234"
   *     }
   * @apiParam {String}   submissionId            Id of the submission to be liked.
   * @apiParam {String}   challengeId             Id of the challenge to which the submission belongs.
   * @apiParam {String}   showId                  Id of the show which challenge belongs to
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
   * @apiHeader {String}    Authorization       Authorization token
   * @apiHeaderExample {json} Example:
   *     {
   *       "Authorization": "Bearer abcxyz1234"
   *     }
   * @apiParam {String}   submissionId            Id of the submission to be retrieved.
   * @apiParam {String}   challengeId             Id of the challenge to which the submission belongs.
   * @apiParam {String}   showId                  Id of the show which challenge belongs to
   */
  findOne(req, res, next) {
    const options = Object.assign({}, req.params);
    return Services.Submission.findOne(options)
      .then(result => res.status(200).send(result))
      .catch(next);
  },
  /**
   * @apiGroup Submission
   * @apiVersion 1.0.0
   * @api {get} /api/challenges/:challengeId/submissions?page=:page&limit=:limit Get submissions list
   * @apiDescription Get list of submissions from a challenge.
   * @apiHeader {String}    Authorization       Authorization token
   * @apiHeaderExample {json} Example:
   *     {
   *       "Authorization": "Bearer abcxyz1234"
   *     }
   * @apiParam {String}   challengeId        Id of the challenge from which the list of submissions is.
   * @apiParam {String}   showId             Id of the show which challenge belongs to
   * @apiParam {Number}   [page=0]           Page number
   * @apiParam {Number}   [limit=50]         Number of submissions
   */
  find(req, res, next) {
    const options = Object.assign({}, req.params, req.query);
    return Services.Submission.find(options)
      .then((submissions) => {
        return {
          total: res.locals.challenge.numberOfSubmissions,
          items: submissions
        };
      })
      .then(result => res.status(200).send(result))
      .catch(next);
  }
};
module.exports = SubmissionController;
'use strict';
const ChallengeController = {
  /**
   * @apiGroup Challenge
   * @apiVersion 1.0.0
   * @api {post} /api/shows/:showId/challenges Create a challenge
   * @apiDescription Create a new challenge.
   * @apiHeader {String}    Authorization       Authorization token
   * @apiHeaderExample {json} Example:
   *     {
   *       "Authorization": "Bearer abcxyz1234"
   *     }
   * @apiParam {String}     showId              Id of the show which challenge belongs to
   * @apiParam {String}     title               Title of the challenge.
   * @apiParam {Date}       expiresAt           When the challenge will be closed after.
   * @apiParam {Object[]}   [prizes]            Array of available prizes.
   * @apiParam {String}     prizes.title        Title of the prize.
   */
  create(req, res, next) {
    const options = Object.assign({}, req.body, req.params);
    return Services.Challenge.create(options, req.account)
      .then(result => res.status(200).send(result))
      .catch(next);
  },

  /**
   * @apiGroup Challenge
   * @apiVersion 1.0.0
   * @api {get} /api/shows/:showId/challenges/:challengeId Get a challenge
   * @apiDescription Get a challenge by its id.
   * @apiHeader {String}    Authorization       Authorization token
   * @apiHeaderExample {json} Example:
   *     {
   *       "Authorization": "Bearer abcxyz1234"
   *     }
   * @apiParam {String}     showId              Id of the show which challenge belongs to
   * @apiParam {String}     challengeId         Id of desired challenge to get.
   */
  findOne(req, res, next) {
    const challenge = res.locals.challenge;
    return Services.Submission.find(req.params)
    .then((submissions) => {
      challenge.submissions = submissions;
      return challenge;
    })
    .then(result => res.status(200).send(result))
    .catch(next);
  },
  /**
   * @apiGroup Challenge
   * @apiVersion 1.0.0
   * @api {get} /api/shows/:showId/challenges?page=:page&limit=:limit Get challenge list
   * @apiDescription Get list of challenges which were created by current account.
   * @apiHeader {String}    Authorization       Authorization token
   * @apiHeaderExample {json} Example:
   *     {
   *       "Authorization": "Bearer abcxyz1234"
   *     }
   * @apiParam {String}   showId           Id of the show which challenge belongs to
   * @apiParam {Number}   [page=0]           Page number
   * @apiParam {Number}   [limit=50]         Number of submissions
   */
  find(req, res, next) {
    const options = Object.assign({ creator: req.account._id.toString() }, req.params, req.query);
    return Services.Challenge.find(options)
      .then(result => res.status(200).send(result))
      .catch(next);
  },

  /**
   * @apiGroup Challenge
   * @apiVersion 1.0.0
   * @api {post} /api/shows/:showId/challenges/:changellenId/join Join a challenge
   * @apiDescription Join a challenge. If user has joined before, nothing happens.
   * @apiHeader {String}    Authorization       Authorization token
   * @apiHeaderExample {json} Example:
   *     {
   *       "Authorization": "Bearer abcxyz1234"
   *     }
   * @apiParam {String}     showId              Id of the show which challenge belongs to
   * @apiParam {String}     challengeId         Id of desired challenge to join.
   */
  join(req, res, next) {
    const options = Object.assign({}, req.params, req.body);
    return Services.Challenge.join(options)
      .then(result => res.status(200).send(result))
      .catch(next);
  },
};
module.exports = ChallengeController;
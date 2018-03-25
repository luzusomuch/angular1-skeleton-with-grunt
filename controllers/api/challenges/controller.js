'use strict';
const ChallengeController = {
  /**
   * @apiGroup Challenge
   * @apiVersion 1.0.0
   * @api {post} /api/challenges Create a challenge
   * @apiDescription Create a new challenge.
   * @apiParam {String}     title               Title of the challenge.
   * @apiParam {Date}       expiresAt           When the challenge will be closed after.
   * @apiParam {Object[]}   [prizes]            Array of available prizes.
   * @apiParam {String}     prizes.title        Title of the prize.
   * @apiParam {Object}     [video]             Video for this challenge.
   * @apiParam {String}     video.originalUrl   The original url of the video.
   * @apiParam {String[]}   video.thumbnails    Array of thumbnails of the video.
   */
  create(req, res, next) {
    const options = req.body;
    return Services.Challenge.create(options, req.user)
      .then(result => res.status(200).send(result))
      .catch(next);
  },

  /**
   * @apiGroup Challenge
   * @apiVersion 1.0.0
   * @api {get} /api/challenges/:challengeId Get a challenge
   * @apiDescription Get a challenge by its id.
   * @apiParam {String} challengeId   Id of desired challenge to get.
   */
  findOne(req, res, next) {
    const challenge = res.locals.challenge;
    return Services.Submission.find({
      challengeId: req.params.challengeId
    })
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
   * @api {post} /api/challenges/:changellenId/join Join a challenge
   * @apiDescription Join a challenge. If user has joined before, nothing happens.
   * @apiParam {String} challengeId   Id of desired challenge to join.
   */
  join(req, res, next) {
    const options = Object.assign({}, req.params, req.body);
    return Services.Challenge.join(options)
      .then(result => res.status(200).send(result))
      .catch(next);
  },
};
module.exports = ChallengeController;
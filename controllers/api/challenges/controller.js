'use strict';
const ChallengeController = {
 /**
   * Create new challenge
   * @param {Object} req            Express request object
   * @param {String} req.name       Full name
   * @param {String} req.email      Email
   * @param {String} req.password   Password
   * @param {Object} res            Express response object
   */
  create(req, res, next) {
    const options = req.body;
    return Services.Challenge.create(options, req.user)
    .then(result => res.status(200).send(result))
    .catch(next);
  },
  /**
   * Find a challenge by id
   * @param {Object} req            Express request object
   * @param {String} req.name       Full name
   * @param {String} req.email      Email
   * @param {String} req.password   Password
   * @param {Object} res            Express response object
   */
  findOne(req, res, next) {
    const options = req.params;
    return Services.Challenge.findOne(options)
    .then(result => res.status(200).send(result))
    .catch(next);
  },
};
module.exports= ChallengeController;

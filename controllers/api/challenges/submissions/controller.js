'use strict';
const SubmissionController = {
  /**
   * Like a submission challenge
   * @param {Object} req            Express request object
   * @param {String} req.name       Full name
   * @param {String} req.email      Email
   * @param {String} req.password   Password
   * @param {Object} res            Express response object
   */
  like(req, res, next) {
    const options = Object.assign({}, req.params, req.body);
    return Services.Submission.like(options)
      .then(result => res.status(200).send(result))
      .catch(next);
  },
};
module.exports = SubmissionController;
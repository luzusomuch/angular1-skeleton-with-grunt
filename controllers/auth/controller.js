'use strict';
const AuthController = {
  /**
   * Login
   * @param {Object} req            Express request object
   * @param {String} req.email      Email
   * @param {String} req.password   Password
   * @param {Object} res            Express response object
   */
  login(req, res, next) {
    const options = Object.assign({}, req.body);
    return Services.Authentication.login(options)
    .then(result => res.status(200).send(result))
    .catch(next);
  },
  /**
   * Create new user
   * @param {Object} req            Express request object
   * @param {String} req.name       Full name
   * @param {String} req.email      Email
   * @param {String} req.password   Password
   * @param {Object} res            Express response object
   */
  createPartner(req, res, next) {
    const options = Object.assign({ role: 'partner' }, req.body);
    return Services.Authentication.create(options)
    .then(result => res.status(200).send(result))
    .catch(next);
  },
   /**
   * Create new user
   * @param {Object} req            Express request object
   * @param {String} req.name       Full name
   * @param {String} req.email      Email
   * @param {String} req.password   Password
   * @param {Object} res            Express response object
   */
  createSdk(req, res, next) {
    const options = Object.assign({ role: 'sdk' }, req.body);
    return Services.Authentication.create(options)
    .then(result => res.status(200).send(result))
    .catch(next);
  }
};
module.exports = AuthController;

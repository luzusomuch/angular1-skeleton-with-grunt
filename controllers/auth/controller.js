'use strict';
const AuthController = {
  /**
   * @api {post} /auth/register
   * @apiDescription Register a new user as partner. The body must contains
   * @apiParam {String}   uid           Email
   * @apiParam {String}  password      Password
   * @apiParam {String}   [firstName]   First name
   * @apiParam {String}   [lastName]    Last name
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

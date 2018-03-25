'use strict';
const AuthController = {
  /**
   * @apiGroup Authentication
   * @apiVersion 1.0.0
   * @api {post} /auth/login Login
   * @apiDescription Login. 
   * @apiParam {String}   uid           Email
   * @apiParam {String}   password      Password
   */
  login(req, res, next) {
    const options = Object.assign({}, req.body);
    return Services.Authentication.login(options)
    .then(result => res.status(200).send(result))
    .catch(next);
  },
  
  /**
   * @apiGroup Authentication
   * @apiVersion 1.0.0
   * @api {post} /auth/register Register a partner
   * @apiDescription Register a new partner. 
   * @apiParam {String}   uid           Email
   * @apiParam {String}   password      Password
   * @apiParam {String}   [firstName]   First name
   * @apiParam {String}   [lastName]    Last name
   */
  createPartner(req, res, next) {
    const options = Object.assign({ role: 'partner' }, req.body);
    return Services.Authentication.create(options)
    .then(result => res.status(200).send(result))
    .catch(next);
  },

  /**
   * @apiGroup Authentication
   * @apiVersion 1.0.0
   * @api {post} /auth/registerSdk Register a SDK
   * @apiDescription Register a new sdk. 
   * @apiParam {String}   uid           API key
   * @apiParam {String}   password      Secret key
   */
  createSdk(req, res, next) {
    const options = Object.assign({ role: 'sdk' }, req.body);
    return Services.Authentication.create(options)
    .then(result => res.status(200).send(result))
    .catch(next);
  }
};
module.exports = AuthController;

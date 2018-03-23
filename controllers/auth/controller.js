'use strict';
const jwt = require('jsonwebtoken');
const errorMessages = nconf.get('errorMessages');
const SESSION_SECRET = nconf.get('SESSION_SECRET');
const baseUrl = nconf.get('appConfig').baseUrl;
const AuthController = {
  /**
   * Login
   * @param {Object} req            Express request object
   * @param {String} req.email      Email
   * @param {String} req.password   Password
   * @param {Object} res            Express response object
   */
  async login(req, res, next) {
    let schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    let result = Joi.validate(req.body, schema);
    if (result.error) {
      return next(result.error);
    }
    try {
      //validate client account
      const body = {
        email: req.body.email.toLowerCase(),
        verified: true
      };
      let user = await db.User.findOne(body).select('+password');
      if (!user) {
        throw errorMessages.loginFailed;
      }
      const matchPassword = await Services.Util.comparePassword(req.body.password, user.password);
      if (!matchPassword) {
        throw errorMessages.loginFailed;
      }
      // Create token
      const token = jwt.sign({ _id: user._id }, SESSION_SECRET, {
        expiresIn: '14d' // 2 weeks
      });
      await db.User.update(body, {
        $set: {
          lastActivity: new Date()
        }
      });
      return res.status(200).json({
        status: 200,
        token: `Bearer ${token}`
      });
    } catch (err) {
      return next(err);
    }
  },
  /**
   * Create new user
   * @param {Object} req            Express request object
   * @param {String} req.name       Full name
   * @param {String} req.email      Email
   * @param {String} req.password   Password
   * @param {Object} res            Express response object
   */
  register(req, res, next) {
    const options = Object.assign({}, req.body);
    return Services.Authentication.register(options)
    .then(result => res.status(200).send(result))
    .catch(next);
  },
  /**
   * Verify email
   * @param {Object} req                        Express request object
   * @param {String} req.verificationCode       Verification Code
   * @param {Object} res                        Express response object
   */
  async verify(req, res, next) {
    let schema = Joi.object().keys({
      password: Joi.string().required()
    });
    let result = Joi.validate(req.body, schema);
    if (result.error) {
      return next(result.error);
    }
    try {
      const hashedPassword = await Services.Util.hashPassword(req.body.password);
      const tokenQuery = {
        value: req.params.token,
        type: 'verification',
        expireAt: {
          $gte: new Date()
        }
      };
      const verificationToken =  await db.Token.findOne(tokenQuery).populate('user');
      if (!verificationToken || !verificationToken.user) {
        throw { message: 'Please click the link from the latest activation email' };
      }
      const user = await db.User.findOneAndUpdate({
        _id: verificationToken.user._id
      }, {
        $set:{
          password: hashedPassword,
          verified: true
        }
      }, {
        new: true
      });
      // remove old token
      await db.Token.remove({
        user: verificationToken.user._id,
        type: 'verification'
      });
      // update if user was invited to a project
      const membershipQuery = {
        email: user.email,
        status: 'pending',
      };
      await db.Membership.update(membershipQuery, {
        $set: {
          user: user._id,
          status: 'accepted'
        }
      });
      Services.Email.send({
        template: 'verified',
        to: user.email,
        locals: user.toObject()
      });
      // Create token
      const token = jwt.sign({ _id: user._id }, SESSION_SECRET, {
        expiresIn: '14d' // 2 weeks
      });
      return res.status(200).send({
        status: 200,
        token: `Bearer ${token}`
      });
    } catch (err) {
      return next(err);
    }
  },
  /**
   * Forgot password
   * @param {Object} req                        Express request object
   * @param {String} req.email                  User Email
   * @param {Object} res                        Express response object
   */
  async forgot(req, res, next) {
    let schema = Joi.object().keys({
      email: Joi.string().required()
    });
    let result = Joi.validate(req.body, schema);
    if (result.error) {
      return next(result.error);
    }
    try {
      let user = await db.User.findOne({ email: req.body.email, verified: true });
      if (!user) {
        return res.status(200).send({ message: 'ok' });
      }
      // remove old token
      await db.Token.remove({
        user: user._id,
        type: 'resetpassword'
      });
      // create token
      const newToken = {
        user: user._id,
        type: 'resetpassword',
        expireAt: moment().add(Constants.SERVER.TOKEN_RESET_PASSWORD_DURATION, 'seconds')
      };
      const token = await db.Token.create(newToken);
      //send verification email to user
      Services.Email.send({
        template: 'forgotPassword',
        to: user.email,
        locals: Object.assign({}, { baseUrl: nconf.get('appConfig:baseUrl') }, user.toObject(), { verificationCode: token.value })
      });
      return res.status(200).json({
        status: 200
      });
    } catch (err) {
      return next(err);
    }
  },
  
  async resetPassword(req, res, next) {
    let schema = Joi.object().keys({
      password: Joi.string().required()
    });
    let result = Joi.validate(req.body, schema);
    if (result.error) {
      return next(result.error);
    }
    try {
      const hashedPassword = await Services.Util.hashPassword(req.body.password);
      const tokenQuery = {
        value: req.params.token,
        type: 'resetpassword',
        expireAt: {
          $gte: new Date()
        }
      };
      const verificationToken =  await db.Token.findOne(tokenQuery).populate('user');
      if (!verificationToken || !verificationToken.user) {
        throw new Error('Please click the link from the latest activation email');
      }
      let user = await db.User.findOneAndUpdate({
        _id: verificationToken.user._id,
        verified: true
      }, {
        $set: {
          password: hashedPassword
        }
      }, {
        new: true
      });
      if (!user) {
        throw new Error('Please click the link from the latest activation email');
      }
      await db.Token.remove({
        user: verificationToken.user._id,
        type: 'resetpassword'
      });
      Services.Email.send({
        template: 'newPassword',
        to: user.email,
        locals: user.toObject()
      });
      return res.status(200).json({ status: 200 });
    } catch (err) {
      return next(err);
    }
  },
  getGoogleOAuthUrl(req, res) {
    const url = Plugins.Google.getOAuthUrl();
    return res.status(200).send({ url });
  },
  getGoogleOAuthToken(req, res) {
    return Plugins.Google.getOAuthToken({ code: req.query.code })
    .then((result) => {
      // if inactive, redirect
      if (result.verificationCode) {
        return res.redirect(`${baseUrl}auth/google?verificationCode=${result.verificationCode}`);
      }
      return res.redirect(`${baseUrl}auth/google?token=${result.token}`);
    })
    .then(result => res.status(200).send(result));
  }
};
module.exports=AuthController;

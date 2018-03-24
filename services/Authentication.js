const jwt = require('jsonwebtoken');
const SESSION_SECRET = nconf.get('SESSION_SECRET');
module.exports = {
  create(options) {
    let schema = Joi.object().keys({
      firstName: Joi.string().allow('').optional(),
      lastName: Joi.string().allow('').optional(),
      uid: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().allow(['partner', 'sdk']).optional()
    });
    let result = Joi.validate(options, schema);
    if (result.error) {
      return Promise.reject(result.error);
    }
    return Services.Util.hashPassword(options.password).then((hashed) => {
      options.password = hashed;
      return db.Account.create(options);
    });
  },
  login(options) {
    let schema = Joi.object().keys({
      uid: Joi.string().required(),
      password: Joi.string().required()
    });
    let result = Joi.validate(options, schema);
    if (result.error) {
      return Promise.reject(result.error);
    }
    //validate client account
    const body = {
      uid: options.uid.toLowerCase(),
      verified: true
    };
    return db.Account.findOne(body).select('+password')
    .lean()
    .then((account) => {
      if (!account) {
        return Promise.reject({ message: 'Login failed' });
      }
      return Services.Util.comparePassword(options.password, account.password)
      .then((match) => {
        if (!match) {
          return Promise.reject({ message: 'Login failed' });
        }
        return account;
      });
    })
    .then((account) => {
      // Create token
      const token = jwt.sign({ _id: account._id, roles: account.role }, SESSION_SECRET, {
        expiresIn: '14d' // 2 weeks
      });
      return db.Account.update(body, {
        $set: {
          lastActivity: new Date()
        }
      }).then(() => ({ token: `Bearer ${token}` }));
    });
  }
};
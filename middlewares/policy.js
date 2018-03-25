const jwt = require('jsonwebtoken');
const SESSION_SECRET = nconf.get('SESSION_SECRET');
const roles = Constants.ROLES;
const authenticate = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method === 'OPTIONS') {
      return resolve();
    }
    const authHeader = req.header('authorization');
    if (!authHeader) {
      return reject({ message: 'Unauthorized' });
    }
    return jwt.verify(authHeader.replace(/bearer\s/i, ''), SESSION_SECRET, (err, payload) => {
      if (err) {
        return reject(err);
      }
      return db.Account.findOneAndUpdate({
        _id: payload._id
      }, {
        $set: {
          lastActivity: new Date()
        }
      }, {
        new: true
      }).then((account) => {
        if (!account) {
          return reject({ message: 'Unauthorized' });
        }
        const newAccount = account.toObject();
        delete newAccount.password;
        return resolve(newAccount);
      }).catch(reject);
    });
  });
};
const policy = {};
policy.is = {
  authenticated: (req, res, next) => {
    return authenticate(req).then((account) => {
      req.account = account;
      return next();
    }).catch(err => res.status(401).send(err));
  },
  roles: (req, res, next) => {
    return authenticate(req).then((account) => {
      if (roles.indexOf(account.role) >= 0) {
        req.account = account;
        return next();
      }
      return res.status(401).send({ message: 'Unauthorized' });
    }).catch(err => res.status(401).send(err));
  }
};
module.exports = policy;
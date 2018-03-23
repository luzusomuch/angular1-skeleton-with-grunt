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
      return db.User.findOneAndUpdate({
        _id: payload._id
      }, {
        $set: {
          lastActivity: new Date()
        }
      }, {
        new: true
      }).then((user) => {
        if (!user) {
          return reject({ message: 'Unauthorized' });
        }
        const newUser = user.toObject();
        delete newUser.password;
        return resolve(newUser);
      }).catch(reject);
    });
  });
};
const policy = {};
policy.is = {
  authenticated: (req, res, next) => {
    return authenticate(req).then((user) => {
      req.user = user;
      return next();
    }).catch(err => res.status(401).send(err));
  },
  roles: (req, res, next) => {
    return authenticate(req).then((user) => {
      if (roles.indexOf(user.role) >= 0) {
        req.user = user;
        return next();
      }
      return res.status(401).send({ message: 'Unauthorized' });
    }).catch(err => res.status(401).send(err));
  }
};
module.exports = policy;
const bcrypt = require('bcrypt');

const Util = {
  hashPassword: password => new Promise ((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return reject(err);
      }
      return resolve(hash);
    });
  }),
  comparePassword: (pw1, pw2) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(pw1, pw2, function (err, isMatch) {
        if (err) {
          return reject(err);
        }
        resolve(isMatch);
      });
    });
  }

};

module.exports = Util;

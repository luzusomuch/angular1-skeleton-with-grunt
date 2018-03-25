'use strict';
const AccountController = {
  getProfile: (req, res, next) => {
    return res.status(200).send('ok');
  }
};
module.exports = AccountController;
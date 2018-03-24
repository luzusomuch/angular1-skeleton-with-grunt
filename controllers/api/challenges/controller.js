'use strict';
const ChallengeController = {
  create: (req, res, next) => {
    return res.status(200).send('ok');
  }
};
module.exports= ChallengeController;

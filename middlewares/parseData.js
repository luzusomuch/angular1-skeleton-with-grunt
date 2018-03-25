module.exports = {
  challenge(req, res, next) {
    return db.Challenge.findOne({
      _id: req.params.challengeId
    }).lean().then((challenge) => {
      if (!challenge) {
        return next({ message: 'Challenge not found' });
      }
      res.locals.challenge = challenge;
      return next();
    }).catch(next);
  }
};
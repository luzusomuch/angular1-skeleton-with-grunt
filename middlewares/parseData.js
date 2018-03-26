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
  },
  show(req, res, next) {
    return db.Show.findOne({
      _id: req.params.showId
    }).lean().then((show) => {
      if (!show) {
        return next({ message: 'show not found' });
      }
      res.locals.show = show;
      return next();
    }).catch(next);
  }
};
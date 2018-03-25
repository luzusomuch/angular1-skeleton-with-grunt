module.exports = {
  like(options) {
    let schema = Joi.object().keys({
      user: Joi.object({
        id: Joi.string().required(),
      }).required(),
      challengeId: Joi.objectId().required(),
      submissionId: Joi.objectId().required(),
    });
    let result = Joi.validate(options, schema);
    if (result.error) {
      return Promise.reject(result.error);
    }
    return db.Submission.findOneAndUpdate({
      challenge: options.challengeId,
      _id: options.submissionId,
      'video.originalUrl': {
        $exists: true
      }
    }, {
      $addToSet: {
        'video.likes': options.user
      }
    }, {
      new: true
    });
  },
  findOne(options) {
    let schema = Joi.object().keys({
      challengeId: Joi.objectId().required(),
      hasVideo: Joi.boolean().optional(),
    });
    let result = Joi.validate(options, schema);
    if (result.error) {
      return Promise.reject(result.error);
    }
    return db.Challenge.findOne({
      _id: options.challengeId
    }).lean()
    .then((challenge) => {
      // get some submission
      const query = {
        challenge: challenge._id
      };
      if ([true, 'true'].indexOf(options.hasVideo) >= 0) {
        query.video = {
          $exists: true
        };
      }
      return db.Submission.find(query, { 'video.likes': { $slice: Constants.ITEMS_PER_PAGE } })
      .limit(Constants.ITEMS_PER_PAGE)
      .lean()
      .then((submissions) => {
        challenge.submissions = submissions;
        return challenge;
      });
    });
  },
};
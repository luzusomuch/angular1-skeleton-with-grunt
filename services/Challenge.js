module.exports = {
  create(options, user) {
    let schema = Joi.object().keys({
      title: Joi.string().allow('').optional(),
      expiresAt: Joi.string().required(),
      prizes: Joi.array().items(Joi.object({
        title: Joi.string().required()
      })).optional(),
      video: Joi.object({
        originalUrl: Joi.string().required(),
        thumbnails: Joi.array().items(Joi.string().optional())
      }).optional()
    });
    let result = Joi.validate(options, schema);
    if (result.error) {
      return Promise.reject(result.error);
    }
    return db.Challenge.create(
      Object.assign({
        creator: user._id
      }, options)
    );
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
  join(options) {
    let schema = Joi.object().keys({
      challengeId: Joi.objectId().required(),
      user: Joi.object({
        id: Joi.string().required(),
      }).required(),
      video: Joi.object({
        originalUrl: Joi.string().required(),
        thumbnails: Joi.array().items(Joi.string().optional())
      }).optional()
    });
    let result = Joi.validate(options, schema);
    if (result.error) {
      return Promise.reject(result.error);
    }
    const newSubmission = Object.assign({}, {
      user: options.user,
      video: options.video,
      challenge: options.challengeId
    });
    return db.Submission.create(newSubmission);
  }
};
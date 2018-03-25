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
  find(options) {
    let schema = Joi.object().keys({
      creator: Joi.objectId().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional()
    });
    let result = Joi.validate(options, schema);
    if (result.error) {
      return Promise.reject(result.error);
    }
    const query = {};
    if (options.creator) {
      query.creator = options.creator;
    }
    const page = parseInt(options.page) || 0;
    const limit = parseInt(options.limit) || Constants.ITEMS_PER_PAGE;
    return Promise.all([
      db.Challenge.count(query),
      db.Challenge.find(query)
      .sort({
        createdAt: -1
      })
      .skip(page * limit)
      .limit(limit)
      .lean()
    ]).then((results) => {
      return {
        total: results[0],
        items: results[1]
      };
    })
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
    // although we have db lock
    // better check if user has joined this challenge before
    return db.Submission.findOne({
      'user.id': options.user.id,
      challenge: options.challengeId
    }).lean().then((submission) => {
      if (submission) {
        return submission;
      }
      const newSubmission = Object.assign({}, {
        user: options.user,
        video: options.video,
        challenge: options.challengeId
      });
      // create submission for this user.
      return db.Submission.create(newSubmission)
        .then(() => {
          // increase the number of submissions for this challenge
          return db.Challenge.update({
            _id: options.challengeId
          }, {
            $inc: {
              numberOfSubmissions: 1
            }
          });
        });
    });
  }
};
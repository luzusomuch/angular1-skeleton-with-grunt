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
      },
      'video.likes': {
        $nin: [options.user]
      }
    }, {
      $addToSet: {
        'video.likes': options.user
      },
      $inc: {
        'video.numberOfLikes': 1
      }
    }, {
      new: true
    });
  },
  findOne(options) {
    let schema = Joi.object().keys({
      challengeId: Joi.objectId().required(),
      submissionId: Joi.objectId().required(),
    });
    let result = Joi.validate(options, schema);
    if (result.error) {
      return Promise.reject(result.error);
    }
    return db.Submission.findOne({
      challenge: options.challengeId,
      _id: options.submissionId
    }, {
      'video.likes': {
        $slice: Constants.ITEMS_PER_PAGE
      }
    }).lean()
    .then((submission) => {
      if (!submission) {
        return Promise.reject({ message: 'No submission' });
      }
      return submission;
    });
  },
};
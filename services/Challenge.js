module.exports = {
  create(options, user) {
    let schema = Joi.object().keys({
      title: Joi.string().allow('').optional(),
      expiresAt: Joi.string().required(),
      prizes: Joi.array().items(Joi.object({
        title: Joi.string().required()
      })).optional(),
      videos: Joi.array().items(Joi.object({
        url: Joi.string().required(),
        thumbnail: Joi.string().optional()
      }).required()).optional()
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
      challengeId: Joi.objectId().required()
    });
    let result = Joi.validate(options, schema);
    if (result.error) {
      return Promise.reject(result.error);
    }
    return db.Challenge.findOne({
      _id: options.challengeId
    }).lean();
  }
};
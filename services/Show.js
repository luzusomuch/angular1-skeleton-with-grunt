module.exports = {
  create(options, user) {
    let schema = Joi.object().keys({
      title: Joi.string().allow('').optional(),
      video: Joi.object({
        originalUrl: Joi.string().required(),
        thumbnails: Joi.array().items(Joi.string().optional())
      }).optional()
    });
    let result = Joi.validate(options, schema);
    if (result.error) {
      return Promise.reject(result.error);
    }
    return db.Show.create(
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
      db.Show.count(query),
      db.Show.find(query)
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
    });
  }
};
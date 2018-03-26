'use strict';
const ShowController = {
  /**
   * @apiGroup Show
   * @apiVersion 1.0.0
   * @api {post} /api/shows Create a show
   * @apiDescription Create a new show.
   * @apiHeader {String}    Authorization       Authorization token
   * @apiHeaderExample {json} Example:
   *     {
   *       "Authorization": "Bearer abcxyz1234"
   *     }
   * @apiParam {String}     title               Title of the show.
   * @apiParam {Object}     [video]             Video for this show.
   * @apiParam {String}     video.originalUrl   The original url of the video.
   * @apiParam {String[]}   video.thumbnails    Array of thumbnails of the video.
   * 
   */
  create(req, res, next) {
    const options = req.body;
    return Services.Show.create(options, req.account)
      .then(result => res.status(200).send(result))
      .catch(next);
  },

  /**
   * @apiGroup Show
   * @apiVersion 1.0.0
   * @api {get} /api/shows/:showId Get a show
   * @apiDescription Get a show by its id.
   * @apiHeader {String}    Authorization       Authorization token
   * @apiHeaderExample {json} Example:
   *     {
   *       "Authorization": "Bearer abcxyz1234"
   *     }
   * @apiParam {String} showId   Id of desired show to get.
   */
  findOne(req, res, next) {
    const show = res.locals.show;
    return Services.Submission.find({
      showId: req.params.showId
    })
    .then((submissions) => {
      show.submissions = submissions;
      return show;
    })
    .then(result => res.status(200).send(result))
    .catch(next);
  },
  /**
   * @apiGroup Show
   * @apiVersion 1.0.0
   * @api {get} /api/shows?page=:page&limit=:limit Get show list
   * @apiDescription Get list of shows which were created by current account.
   * @apiHeader {String}    Authorization       Authorization token
   * @apiHeaderExample {json} Example:
   *     {
   *       "Authorization": "Bearer abcxyz1234"
   *     }
   * @apiParam {Number}   [page=0]           Page number
   * @apiParam {Number}   [limit=50]         Number of submissions
   */
  find(req, res, next) {
    const options = Object.assign({ creator: req.account._id.toString() }, req.params, req.query);
    return Services.Show.find(options)
      .then(result => res.status(200).send(result))
      .catch(next);
  }
};
module.exports = ShowController;
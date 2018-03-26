'use strict';
const ShowController = require('./controller');
module.exports = function (router) {
  router.use('/:showId', Middlewares.Parsers.show);
  require('./challenges')(router);
  require('./challenges/submissions')(router);
  router.post('/',
    ShowController.create
  );
  router.get('/:showId',
    ShowController.findOne
  );
  router.get('/',
    ShowController.find
  );
};
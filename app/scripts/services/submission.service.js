'use strict';
angular.module('measureApp').factory('SubmissionService', function($resource, apiUrl){
  return $resource(apiUrl + '/api/shows/:showId/challenges/:challengeId/submissions/:id/:route', {}, {
    list: {
      method: 'GET',
      params: {
        showId: '@showId',
        challengeId: '@challengeId'
      },
      isArray: false,
    },
    get: {
      method: 'GET',
      params: {
        showId: '@showId',
        challengeId: '@challengeId',
        id: '@id',
      },
      isArray: false,
    },
    delete: {
      method: 'POST',
      params: {
        showId: '@showId',
        challengeId: '@challengeId',
        id: '@id',
        route: 'delete'
      },
      isArray: false,
    },
    setAsWinner: {
      method: 'POST',
      url: apiUrl + '/api/shows/:showId/challenges/:challengeId/submissions/:id/win',
      params: {
        showId: '@showId',
        challengeId: '@challengeId',
        id: '@id'
      },
      isArray: false,
    },
    getProScore: {
      method: 'POST',
      url: apiUrl + '/api/shows/:showId/challenges/:challengeId/submissions/:id/getScore',
      params: {
        showId: '@showId',
        challengeId: '@challengeId',
        id: '@id'
      },
      isArray: false,
    },
  });
});
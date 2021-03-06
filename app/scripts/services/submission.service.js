'use strict';
angular.module('measureApp').factory('SubmissionService', function($resource, apiUrl){
  return $resource(apiUrl + '/api/shows/:showId/challenges/:challengeId/submissions/:id', {}, {
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
    setAsWinner: {
      method: 'POST',
      url: apiUrl + '/api/shows/:showId/challenges/:challengeId/submissions/:id/win',
      params: {
        showId: '@showId',
        challengeId: '@challengeId',
        id: '@id'
      },
      isArray: false,
    }
  });
});
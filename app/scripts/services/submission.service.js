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
    create: {
      method: 'POST',
      params: {
        showId: '@showId',
        challengeId: '@challengeId',
      },
      isArray: false,
    },
    update: {
      method: 'PUT',
      params: {
        showId: '@showId',
        challengeId: '@challengeId',
        id: '@id',
      },
      isArray: false,
    }
  });
});
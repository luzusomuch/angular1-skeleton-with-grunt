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
    delete: {
      method: 'delete',
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
    approve: {
      method: 'POST',
      url: apiUrl + '/api/shows/:showId/challenges/:challengeId/submissions/:id/approve',
      params: {
        showId: '@showId',
        challengeId: '@challengeId',
        id: '@id'
      },
      isArray: false,
    },
    unapprove: {
      method: 'POST',
      url: apiUrl + '/api/shows/:showId/challenges/:challengeId/submissions/:id/unapprove',
      params: {
        showId: '@showId',
        challengeId: '@challengeId',
        id: '@id'
      },
      isArray: false,
    },
  });
});
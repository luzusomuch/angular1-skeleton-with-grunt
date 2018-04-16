'use strict';
angular.module('measureApp').factory('ChallengeService', function($resource, apiUrl){
  return $resource(apiUrl + '/api/shows/:showId/challenges/:id', {}, {
    list: {
      method: 'GET',
      params: {
        showId: '@showId'
      },
      isArray: false,
    },
    get: {
      method: 'GET',
      params: {
        showId: '@showId',
        id: '@id',
      },
      isArray: false,
    },
    create: {
      method: 'POST',
      params: {
        showId: '@showId'
      },
      isArray: false,
    },
    update: {
      method: 'PUT',
      params: {
        showId: '@showId',
        id: '@id',
      },
      isArray: false,
    },
    otherWinnerhNotifications: {
      method: 'POST',
      url: apiUrl + '/api/shows/:showId/challenges/:id/prizes/:prizeIndex/otherwinnernotifications',
      params: {
        showId: '@showId',
        id: '@id',
        prizeIndex: '@prizeIndex',
      }
    },
    selfWinnerhNotifications: {
      method: 'POST',
      url: apiUrl + '/api/shows/:showId/challenges/:id/prizes/:prizeIndex/selfwinnernotifications',
      params: {
        showId: '@showId',
        id: '@id',
        prizeIndex: '@prizeIndex',
      }
    }
  });
});
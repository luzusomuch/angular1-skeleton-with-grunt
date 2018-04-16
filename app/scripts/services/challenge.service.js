'use strict';
angular.module('measureApp').factory('ChallengeService', function($resource, apiUrl){
  return $resource(apiUrl + '/api/shows/:showId/challenges/:id/:route', {}, {
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
      params: {
        showId: '@showId',
        id: '@id',
        route: 'otherwinnerhnotifications'
      }
    },
    selfWinnerhNotifications: {
      method: 'POST',
      params: {
        showId: '@showId',
        id: '@id',
        route: 'selfWinnerhNotifications'
      }
    }
  });
});
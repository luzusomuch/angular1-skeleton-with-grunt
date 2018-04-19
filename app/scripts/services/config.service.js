'use strict';
angular.module('measureApp').factory('ConfigService', function($resource, apiUrl){
  return $resource(apiUrl + '/config/:id', {}, {
    create: {
      method: 'POST',
      isArray: false,
    },
    update: {
      method: 'PUT',
      params: {
        id: '@id'
      },
      isArray: false
    },
    get: {
      method: 'PUT',
      params: {
        id: '@id'
      },
      isArray: false
    },
    list: {
      method: 'GET',
      isArray: false,
    }
  });
});
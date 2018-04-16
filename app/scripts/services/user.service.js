'use strict';
angular.module('measureApp').factory('UserService', function($resource, apiUrl){
  return $resource(apiUrl + '/users/:id', {}, {
    get: {
      method: 'GET',
      params: {
        id: '@id'
      },
      isArray: false,
    },
    update: {
      method: 'PUT',
      params: {
        id: '@id'
      },
      isArray: false,
    }
  });
});
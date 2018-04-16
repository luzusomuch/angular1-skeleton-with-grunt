'use strict';
angular.module('measureApp').factory('AccountService', function($resource, apiUrl){
  return $resource(apiUrl + '/api/accounts/:id', {}, {
    list: {
      method: 'GET',
      isArray: false,
    },
    get: {
      method: 'GET',
      params: {
        id: '@id',
      },
      isArray: false,
    },
    update: {
      method: 'PUT',
      params: {
        id: '@id',
      },
      isArray: false,
    },
  });
});
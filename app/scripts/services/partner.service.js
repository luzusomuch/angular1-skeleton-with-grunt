'use strict';
angular.module('measureApp').factory('PartnerService', function($resource, apiUrl){
  return $resource(apiUrl + '/api/partners/:id', {}, {
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
    create: {
      method: 'POST',
      isArray: false,
    },
    update: {
      method: 'PUT',
      params: {
        id: '@id',
      },
      isArray: false,
    },
    delete: {
      method: 'DELETE',
      params: {
        id: '@id',
      },
      isArray: false
    }
  });
});
'use strict';
angular.module('measureApp').factory('VideoService', function($resource, apiUrl){
  return $resource(apiUrl + '/api/videos/:id', {}, {
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
    }
  });
});
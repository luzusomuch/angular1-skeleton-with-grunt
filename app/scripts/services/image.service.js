'use strict';
angular.module('measureApp').factory('ImageService', function($resource, apiUrl){
  return $resource(apiUrl + '/api/images', {}, {
    create: {
      method: 'POST',
      isArray: false,
    }
  });
});
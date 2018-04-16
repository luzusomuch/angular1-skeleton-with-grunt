'use strict';
angular.module('measureApp').factory('TestService', function($resource, apiUrl){
  return $resource(apiUrl + '/test', {}, {
    testPartnerHook: {
      url: apiUrl + '/test/testpartnerhook',
      method: 'POST',
      isArray: false,
    },
  });
});
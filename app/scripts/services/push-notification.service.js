'use strict';
angular.module('measureApp').factory('PushNotificationService', function($resource, apiUrl){
  return $resource(apiUrl + '/api/notifications/:id', {}, {
    create: {
      method: 'POST',
      isArray: false,
    }
  });
});
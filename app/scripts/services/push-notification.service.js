'use strict';
angular.module('measureApp').factory('PushNotificationService', function($resource, apiUrl){
  return $resource(apiUrl + '/api/notifications/:id', {}, {
    sendPush: {
      method: 'POST',
      isArray: false,
    }
  });
});
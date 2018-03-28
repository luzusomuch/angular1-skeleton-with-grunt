'use strict';
angular.module('measureApp').factory('httpRequestInterceptor', function ($cookies) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($cookies.get('token') && config.url.indexOf('s3-us-west-1.amazonaws.com') < 0) {
        config.headers.Authorization = $cookies.get('token');
      }

      return config;
    }
  };
});
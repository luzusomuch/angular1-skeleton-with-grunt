'use strict';
angular.module('measureApp').factory('httpRequestInterceptor', function ($cookies, $q, $injector) {
  var state;
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($cookies.get('token') && config.url.indexOf('s3-us-west-1.amazonaws.com') < 0) {
        config.headers.Authorization = $cookies.get('token');
      }
      if (config.method === 'PUT' && config.url.indexOf('s3-us-west-1.amazonaws.com') !== -1) {
        config.headers['Content-Type'] = 'video/mp4';
      }
      return config;
    },
    // Intercept 401s and redirect you to login
    responseError: function(response) {
      if (response.status === 401) {
        (state || (state = $injector.get('$state')))
        .go('login');
        // remove any stale tokens
        $cookies.remove('token');
      }
      return $q.reject(response);
    }
  };
});
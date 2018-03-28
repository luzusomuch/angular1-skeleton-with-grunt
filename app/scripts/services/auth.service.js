'use strict';

angular.module('measureApp').factory('AuthService', function ($q, $http, apiUrl) {
  return {
    login: function (credentials) {
      return $http.post(apiUrl+'/auth/login', {
        uid: credentials.uid,
        password: credentials.password
      }).then(function(resp) {
        console.log(resp);
      }).catch(function(err) {
        console.log(err);
      });
    },

    logout: function () {
      // AuthServer.logout();
    }
  };
});

'use strict';

angular.module('measureApp').factory('AuthService', function ($q, $http, apiUrl, $cookies, UserService) {
  var currentUser = {};
  return {
    login: function (credentials) {
      return $http.post(apiUrl+'/auth/login', {
        uid: credentials.uid,
        password: credentials.password
      }).then(function(resp) {
        $cookies.put('token', resp.data.token);
        // UserService.get({id: 'me'}).$promise.then(function(resp) {
        //   console.log(resp);
        // }).catch(function(err) {
        //   console.log(err);
        // });
        return $q.resolve();
      }).catch(function(err) {
        return $q.reject(err);
      });
    },

    logout: function () {
      $cookies.remove('token');
      currentUser = {};
    },

    forgotPassword: function(email) {
      return $http.post(apiUrl+'/auth/forgot-password', {
        email: email
      }).then(function() {
        return $q.resolve();
      }).catch(function() {
        return $q.reject();
      });
    },

    recoverPassword: function(token, password) {
      return $http.post(apiUrl+'/auth/recover-password/'+token, {
        password: password
      }).then(function() {
        return $q.resolve();
      }).catch(function() {
        return $q.reject();
      });
    },

    registerPartner: function(data) {
      return $http.post(apiUrl+'/auth/register', data).then(function(resp) {
        return $q.resolve(resp);
      }).catch(function(err) {
        return $q.reject(err);
      });
    }
  };
});

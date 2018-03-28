'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'scripts/app/login/view.html',
    controller: 'LoginController',
    data: {
      hideHeader: true,
      hideFooter: false,
      pageTitle: 'Login'
    }
  })
  .state('logout', {
    url: '/logout',
    controller: 'LogoutController'
  });
});

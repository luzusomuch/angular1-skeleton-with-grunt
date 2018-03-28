'use strict';
angular.module('measureApp', [
  'ngResource',
  'ngCookies',
  'ngAria',
  'ngSanitize',
  'ngAnimate',
  'ui.router',
  'ngAnimate',
])
.config(function($urlRouterProvider, $locationProvider) {
  // $locationProvider.html5Mode(true);
  // $urlRouterProvider.otherwise('/login');
})
.run(function($rootScope) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $rootScope.pageTitle = toState.data.pageTitle || 'Measure Admin Page';
  });
});

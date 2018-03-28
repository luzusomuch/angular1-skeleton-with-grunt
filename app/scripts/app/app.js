'use strict';
angular.module('measureApp', [
  'ngResource',
  'ngCookies',
  'ngAria',
  'ngSanitize',
  'ngAnimate',
  'ui.router',
  'ngAnimate',
  'angular-growl',
])
.config(function($urlRouterProvider, $locationProvider, $httpProvider, growlProvider, $stateProvider) {
  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
  });
  // $locationProvider.html5Mode(true);
  // $urlRouterProvider.otherwise('/login');
  $httpProvider.interceptors.push('httpRequestInterceptor');
  growlProvider.globalTimeToLive(3000);
  growlProvider.globalDisableCountDown(true);
})
.run(function($rootScope) {
  $rootScope.$on('$stateChangeStart', function(event, next, nextParams) {
    $rootScope.pageTitle = next.pageTitle || 'Measure Admin Page';
    $rootScope.hideHeader = next.hideHeader;
    $rootScope.hideFooter = next.hideFooter;
  });
});

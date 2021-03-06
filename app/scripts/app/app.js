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
  'ngFileUpload',
  'ui.bootstrap',
  'com.2fdevs.videogular',
  'com.2fdevs.videogular.plugins.controls',
  'com.2fdevs.videogular.plugins.buffering',
  'com.2fdevs.videogular.plugins.overlayplay'
])
.config(function($urlRouterProvider, $locationProvider, $httpProvider, growlProvider, $stateProvider) {
  $stateProvider.state('app', {
    url: '/app',
    template: '<ui-view/>',
    abstract: true,
    isAuthenticate: true,
    resolve: {
      pageSettings:['$http', 'apiUrl', function($http, apiUrl) {
        return $http.get(apiUrl + '/settings').then(function(resp) {
          return resp.data;
        });
      }]
    }
  });
  // $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/login');
  $httpProvider.interceptors.push('httpRequestInterceptor');
  growlProvider.globalTimeToLive(3000);
  growlProvider.globalDisableCountDown(true);
})
.run(function($rootScope, $cookies, $state) {
  $rootScope.$on('$stateChangeStart', function(event, next, nextParams) {
    if (next.isAuthenticate) {
      var token = $cookies.get('token');
      if (!token || token.length === 0) {
        return $state.go('login');
      }
    }
    $rootScope.pageTitle = next.pageTitle || 'Measure Admin Page';
    $rootScope.hideHeader = next.hideHeader;
    $rootScope.hideFooter = next.hideFooter;
  });
});

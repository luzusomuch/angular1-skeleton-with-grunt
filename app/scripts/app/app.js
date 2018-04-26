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
    authenticate: true,
    resolve: {
      pageSettings:['$http', 'apiUrl', '$rootScope', function($http, apiUrl, $rootScope) {
        return $http.get(apiUrl + '/settings').then(function(resp) {
          $rootScope.pageSettings = resp.data;
          return $rootScope.pageSettings;
        });
      }]
    }
  });
  $urlRouterProvider.otherwise('/login');
  $httpProvider.interceptors.push('httpRequestInterceptor');
  growlProvider.globalTimeToLive(3000);
  growlProvider.globalDisableCountDown(true);
})
.run(function($rootScope, $cookies, $state, growl) {
  $rootScope.$on('$stateChangeStart', function(event, next, nextParams) {
    if (next.authenticate) {
      var token = $cookies.get('token');
      if (!token || token.length === 0) {
        setTimeout(function() {
          growl.error('Your token was expired. Please login again');
          window.location.href = '/#/login';
          return;
        }, 500);
      }
    } else {
      $rootScope.pageTitle = next.pageTitle || 'Measure Admin Page';
      $rootScope.hideHeader = next.hideHeader;
      $rootScope.hideFooter = next.hideFooter;
    }
  });
});

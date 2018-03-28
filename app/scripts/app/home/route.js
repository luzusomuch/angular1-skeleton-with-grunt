'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('home', {
    url: '/app',
    abstract: true,
    templateUrl: 'scripts/app/home/view.html',
    controller: 'HomeController',
    data: {
      hideHeader: false,
      hideFooter: false,
      authenticate: true,
    }
  });
});

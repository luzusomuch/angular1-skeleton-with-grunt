'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('app.home', {
    url: '/home',
    templateUrl: 'scripts/app/home/view.html',
    hideHeader: false,
    hideFooter: false,
    authenticate: true,
    pageTitle: 'Home'
  });
});

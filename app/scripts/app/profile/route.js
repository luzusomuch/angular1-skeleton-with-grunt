'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('app.profile', {
    url: '/profile',
    templateUrl: 'scripts/app/profile/view.html',
    controller: 'ProfileController',
    pageTitle: 'Profile Page'
  });
});

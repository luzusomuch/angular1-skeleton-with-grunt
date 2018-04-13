'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('app.setting', {
    url: '/settings',
    templateUrl: 'scripts/app/settings/view.html',
    controller: 'SettingsController',
    pageTitle: 'Settings'
  });
});

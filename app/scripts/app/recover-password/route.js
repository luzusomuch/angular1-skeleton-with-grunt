'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('recoverPassword', {
    url: '/recover-password/:token',
    templateUrl: 'scripts/app/recover-password/view.html',
    controller: 'RecoverPasswordController',
    hideHeader: true,
    hideFooter: true,
    pageTitle: 'Recover Password'
  });
});

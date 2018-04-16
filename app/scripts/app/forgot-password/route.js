'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('forgotPassword', {
    url: '/forgot-password',
    templateUrl: 'scripts/app/forgot-password/view.html',
    controller: 'ForgotPasswordController',
    hideHeader: true,
    hideFooter: true,
    pageTitle: 'Forgot Password'
  });
});

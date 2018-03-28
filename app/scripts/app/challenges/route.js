'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('app.challenge', {
    url: '/challenge',
    abstract: true,
    template: '<ui-view/>'
  }).state('app.challenge.list', {
    url: '/list',
    templateUrl: 'scripts/app/challenges/list/view.html',
    controller: 'ChallengesListController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Challenges List'
  }).state('app.challenge.update', {
    url: '/:id/update',
    templateUrl: 'scripts/app/challenges/update/view.html',
    controller: 'UpdateChallengeController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Update Challenge'
  });
});

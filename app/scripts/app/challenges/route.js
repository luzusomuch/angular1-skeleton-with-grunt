'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('app.challenge', {
    url: '/challenge/:showId',
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
  }).state('app.challenge.create', {
    url: '/create',
    templateUrl: 'scripts/app/challenges/create/view.html',
    controller: 'CreateChallengeController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Create Challenge'
  }).state('app.challenge.update', {
    url: '/:id/update',
    templateUrl: 'scripts/app/challenges/update/view.html',
    controller: 'UpdateChallengeController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Update Challenge',
    resolve: {
      challengeDetail: ['ChallengeService', '$stateParams', '$state', 'growl', 
      function(ChallengeService, $stateParams, $state, growl) {
        return ChallengeService.get({showId: $stateParams.showId, id: $stateParams.id}).$promise.then(function(resp) {
          return resp;
        }).catch(function() {
          growl.error('Something wrong. Please try again later');
          $state.go('app.challenge.list', {showId: $stateParams.showId});
        });
      }]
    }
  });
});

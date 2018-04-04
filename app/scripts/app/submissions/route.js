'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('app.submission', {
    url: '/submission/:showId/:challengeId',
    abstract: true,
    template: '<ui-view/>'
  }).state('app.submission.list', {
    url: '/list',
    templateUrl: 'scripts/app/submissions/list/view.html',
    controller: 'SubmissionsListController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Submissions List'
  });
});

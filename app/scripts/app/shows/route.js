'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('app.show', {
    url: '/show',
    abstract: true,
    template: '<ui-view/>'
  }).state('app.show.list', {
    url: '/list',
    templateUrl: 'scripts/app/shows/list/view.html',
    controller: 'ShowsListController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Shows List'
  }).state('app.show.create', {
    url: '/create',
    templateUrl: 'scripts/app/shows/create/view.html',
    controller: 'CreateShowController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Create Show'
  }).state('app.show.update', {
    url: '/:id/update',
    templateUrl: 'scripts/app/shows/update/view.html',
    controller: 'UpdateShowController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Update Show'
  });
});

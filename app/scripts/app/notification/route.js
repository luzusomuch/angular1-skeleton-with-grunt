'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('app.notification', {
    url: '/notification',
    abstract: true,
    template: '<ui-view/>'
  }).state('app.notification.list', {
    url: '/list',
    templateUrl: 'scripts/app/notification/list/view.html',
    controller: 'NotificationsListController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Notifications List'
  }).state('app.notification.create', {
    url: '/create',
    templateUrl: 'scripts/app/notification/create/view.html',
    controller: 'CreateNotificationController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Create Notification'
  }).state('app.notification.update', {
    url: '/:id/update',
    templateUrl: 'scripts/app/notification/edit/view.html',
    controller: 'EditNotificationController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Update Notification',
    resolve: {
      contentDetail: ['ConfigService', '$stateParams', 'growl', '$state', function(ConfigService, $stateParams, growl, $state) {
        return ConfigService.get({id: $stateParams.id}).$promise.then(function(resp) {
          return resp;
        }).catch(function() {
          growl.error('Cannot get notifiaction detail');
          return $state.go('app.notification.list');
        });
      }],
    }
  });
});

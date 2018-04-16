'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('app.partner', {
    url: '/partner',
    abstract: true,
    template: '<ui-view/>'
  }).state('app.partner.list', {
    url: '/list',
    templateUrl: 'scripts/app/partner/list/view.html',
    controller: 'PartnerListController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Partners List'
  }).state('app.partner.create', {
    url: '/create',
    templateUrl: 'scripts/app/partner/create/view.html',
    controller: 'CreatePartnerController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Create Partner'
  }).state('app.partner.edit', {
    url: '/edit/:id',
    templateUrl: 'scripts/app/partner/edit/view.html',
    controller: 'EditPartnerController',
    authenticate: true,
    hideHeader: false,
    hideFooter: false,
    pageTitle: 'Edit Partner',
    resolve: {
        partnerDetail: ['AccountService', '$stateParams', '$state', 'growl', function(AccountService, $stateParams, $state, growl) {
            return AccountService.get({id: $stateParams.id}).$promise.then(function(resp) {
                return resp;
            }).catch(function() {
                growl.error('Error when getting partner detail');
                $state.go('app.partner.list');
            });
        }]
    }
  });
});

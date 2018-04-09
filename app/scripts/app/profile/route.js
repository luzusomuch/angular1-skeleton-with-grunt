'use strict';

angular.module('measureApp').config(function ($stateProvider) {
  $stateProvider.state('app.profile', {
    url: '/profile',
    templateUrl: 'scripts/app/profile/view.html',
    controller: 'ProfileController',
    pageTitle: 'Profile Page',
    resolve: {
      user: ['UserService', '$state', 'growl', function(UserService, $state, growl) {
        return UserService.get({id: 'me'}).$promise.then(function(resp) {
          return resp;
        }).catch(function() {
          growl.error('Error when getting user information');
          $state.go('app.show.list');
        });
      }]
    }
  });
});

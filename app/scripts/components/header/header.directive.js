'use strict';

angular.module('measureApp').directive('header', function (AuthService) {
  return {
    restrict: 'E',
    templateUrl: 'scripts/components/header/view.html',
    link: function(scope) {
      // scope.menuItems = [{
      //   label: 'Partners',
      //   sref: 'app.partner.list',
      //   faClass: 'fa fa-user'
      // }, {
      //   label: 'Shows',
      //   sref: 'app.show.list',
      //   faClass: 'fa fa-server'
      // }];
      scope.menuItems = [{
        label: 'Shows',
        sref: 'app.show.list',
        faClass: 'fa fa-server'
      }, {
        label: 'Notifications',
        sref: 'app.notification.list',
        faClass: 'fa fa-bell'
      }];
    }
  };
});

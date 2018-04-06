(function () {
  'use strict';
  angular.module('measureApp').controller('WarningModalController', WarningModalController);

  /* @ngInject */
  function WarningModalController($uibModalInstance, title, description) {
    this.title = title;
    this.description = description;

    this.okay = function() {
      $uibModalInstance.close();
    };
  }
})();

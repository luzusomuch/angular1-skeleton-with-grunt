(function () {
  'use strict';
  angular.module('measureApp').controller('ConfirmModalController', ConfirmModalController);

  /* @ngInject */
  function ConfirmModalController($uibModalInstance, title, description) {
    this.title = title;
    this.description = description;

    this.close = function() {
      $uibModalInstance.dismiss();
    };

    this.okay = function() {
      $uibModalInstance.close();
    };
  }
})();

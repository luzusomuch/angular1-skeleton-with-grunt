(function () {
  'use strict';
  angular.module('measureApp').controller('SelectSubmissionWinnerModalController', SelectSubmissionWinnerModalController);

  /* @ngInject */
  function SelectSubmissionWinnerModalController($uibModalInstance, challengeDetail) {
    this.challengeDetail = challengeDetail;
    this.selectedPrizeIndex = 0;

    this.submit = function() {
      $uibModalInstance.close(this.selectedPrizeIndex);
    };

    this.close = function() {
      $uibModalInstance.dismiss();
    };
  }
})();

(function () {
  'use strict';
  angular.module('measureApp').controller('SelectSubmissionWinnerModalController', SelectSubmissionWinnerModalController);

  /* @ngInject */
  function SelectSubmissionWinnerModalController($uibModalInstance, challengeDetail, submissionDetail, $uibModal, growl) {
    this.challengeDetail = angular.copy(challengeDetail);
    var swm = this;
    _.each(submissionDetail.prizes, function(prize) {
      swm.challengeDetail.prizes[prize.prizeIndex].isSelected = true;
    });

    this.submit = function() {
      var prizesIndex = [];
      _.each(this.challengeDetail.prizes, function(prize, $index) {
        if (prize.isSelected) {
          prizesIndex.push($index);
        }
      });
      if (prizesIndex.length > 0) {
        $uibModal.open({
          controller: 'ConfirmModalController',
          controllerAs: 'cm',
          templateUrl: 'scripts/components/confirmModal/view.html',
          resolve: {
            title: function() {
              return 'Select Prize Confirmation';
            },
            description: function() {
              return 'This challenge will be closed if it has 2 winners. <br> You have just selected this submission as a winner. Are you sure?';
            },
            confirmButton: function() {
              return 'Confirm';
            }
          }
        }).result.then(function() {
          $uibModalInstance.close(prizesIndex);
        });
      } else {
        growl.error('Please select at least one prize');
      }
    };

    this.close = function() {
      $uibModalInstance.dismiss();
    };
  }
})();

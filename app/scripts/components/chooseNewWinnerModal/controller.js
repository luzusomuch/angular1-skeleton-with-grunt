(function () {
  'use strict';
  angular.module('measureApp').controller('ChooseNewWinnerModalController', ChooseNewWinnerModalController);

  /* @ngInject */
  function ChooseNewWinnerModalController($uibModalInstance, $stateParams, currentSubmission, SubmissionService, $uibModal, growl) {
    var cnwm = this;

    cnwm.currentSubmission = currentSubmission;
    cnwm.filter = {};
    cnwm.pagination = {
      page: 1,
      limit: 20,
    };
    cnwm.items = [];
    cnwm.total = 0;

    function search(params) {
      params = params || {};
      _.merge(params, angular.copy(cnwm.pagination));
      params.page--;
      params.showId = $stateParams.showId;
      params.challengeId = $stateParams.challengeId;
      params.userName = cnwm.filter.userName;
      params.likeNumber = cnwm.filter.likeNumber;
      params.proScore = cnwm.filter.proScore;
      SubmissionService.list(params).$promise.then(function(resp) {
        _.each(resp.items, function(item) {
          item.prizesTitle = _.map(item.prizes, function(prize) {
            return prize && prize.title;
          });
        });
        var index = _.findIndex(resp.items, function(item) {
          return item._id === currentSubmission._id;
        });
        // if (index !== -1) {
        //   resp.items.splice(index, 1);
        //   resp.total--;
        // }
        cnwm.items = resp.items;
        cnwm.total = resp.total;
      });
    }

    search();

    this.pageChanged = function() {
      search();
    };

    this.viewVideo = function(item) {
      $uibModal.open({
        controller: 'ViewVideoModalController',
        controllerAs: 'vm',
        templateUrl: 'scripts/components/viewVideoModal/view.html',
        resolve: {
          videoDetail: function() {
            return item.content.video;
          }
        }
      });
    };

    this.getProScore = function(submission) {
      SubmissionService.getProScore({
        showId: $stateParams.showId,
        challengeId: $stateParams.challengeId,
        id: submission._id,
      }).$promise.then(function(resp) {
        submission.content.proScore = resp.content.proScore;
        growl.success('Get pro-score successfully');
      }).catch(function() {
        growl.error('Error when get pro-score');
      });
    };

    this.submit = function() {
      var selectedSubmission = _.filter(cnwm.items, function(item) {
        return item.isSelected;
      });
      if (selectedSubmission.length > 0) {
        $uibModalInstance.close(selectedSubmission);
      } else {
        growl.error('Please select new winner for this prize');
      }
    };

    this.close = function() {
      $uibModalInstance.dismiss();
    };
  }
})();

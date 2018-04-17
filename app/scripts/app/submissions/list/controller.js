(function () {
  'use strict';
  angular.module('measureApp').controller('SubmissionsListController', SubmissionsListController);

  /* @ngInject */
  function SubmissionsListController($scope, $state, $stateParams, $q, SubmissionService, ChallengeService, growl, $uibModal) {
    $scope.pagination = {
      page: 1,
      limit: 20,
    };
    $scope.filter = {};
    $scope.items = [];
    $scope.total = 0;

    $scope.challengeDetail = {};
    $scope.hasWinner = false;

    function getChallengeDetail() {
      ChallengeService.get({showId: $stateParams.showId, id: $stateParams.challengeId}).$promise.then(function(resp) {
        $scope.challengeDetail = resp;
        $scope.hasWinner = _.filter($scope.challengeDetail.prizes, function(prize) {
          return prize.winner && prize.winner._id;
        }).length;
      });
    }

    function search(params) {
      params = params || {};
      _.merge(params, angular.copy($scope.pagination));
      params.page--;
      params.showId = $stateParams.showId;
      params.challengeId = $stateParams.challengeId;
      params.userName = $scope.filter.userName;
      params.likeNumber = $scope.filter.likeNumber;
      params.proScore = $scope.filter.proScore;
      SubmissionService.list(params).$promise.then(function(resp) {
        $scope.items = resp.items;
        $scope.total = resp.total;
      });
    }

    search();
    getChallengeDetail();

    $scope.pageChanged = function() {
      search();
    };

    $scope.onEnterUserName = function(e) {
      if (e.keyCode === 13) {
        search();
      }
    };

    $scope.onEnterLikeNumber = function(e) {
      if (e.keyCode === 13) {
        search();
      }
    };

    $scope.onEnterProScore = function(e) {
      if (e.keyCode === 13) {
        search();
      }
    };

    $scope.setPrize = function(item) {
      $uibModal.open({
        controller: 'SelectSubmissionWinnerModalController',
        controllerAs: 'swm',
        templateUrl: 'scripts/components/selectSubmissionWinnerModal/view.html',
        resolve: {
          challengeDetail: function() {
            return $scope.challengeDetail;
          },
          submissionDetail: function() {
            return item;
          }
        }
      }).result.then(function(prizeIndexes) {
        SubmissionService.setAsWinner({
          showId: $stateParams.showId,
          challengeId: $stateParams.challengeId,
          id: item._id,
        }, {prizeIndexes: prizeIndexes}).$promise.then(function() {
          search();
          getChallengeDetail();
          growl.success('Select winner submission successfully');
        }).catch(function() {
          growl.error('Error when select winner submission');
        });
      });
    };

    $scope.viewVideo = function(item) {
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

    $scope.notificationWinnerAnnouncement = function() {
      $uibModal.open({
        controller: 'ConfirmModalController',
        controllerAs: 'cm',
        templateUrl: 'scripts/components/confirmModal/view.html',
        resolve: {
          title: function() {
            return 'Winner announcement';
          },
          description: function() {
            return 'Do you want to send winner announcement notification to everybody?';
          },
          confirmButton: function() {
            return 'Send';
          }
        }
      }).result.then(function() {
        var prizes = angular.copy($scope.challengeDetail.prizes);
        if (prizes[0]) {
          ChallengeService.otherWinnerhNotifications({
            showId: $stateParams.showId,
            id: $stateParams.challengeId,
            prizeIndex: 0,
          }, {}).$promise.then(function() {
            if (prizes[1]) {
              ChallengeService.otherWinnerhNotifications({
                showId: $stateParams.showId,
                id: $stateParams.challengeId,
                prizeIndex: 1,
              }, {}).$promise.then(function() {
                growl.success('Sent winner announcement notification successfully');
              });
            } else {
              growl.success('Sent winner announcement notification successfully');
            }
          });
        }
      });
    };

    $scope.notificationToWinner = function() {
      $uibModal.open({
        controller: 'ConfirmModalController',
        controllerAs: 'cm',
        templateUrl: 'scripts/components/confirmModal/view.html',
        resolve: {
          title: function() {
            return 'Notification to winner(s)';
          },
          description: function() {
            return 'Do you want to send notification to winner(s) submission?';
          },
          confirmButton: function() {
            return 'Send';
          }
        }
      }).result.then(function() {
        var prizes = angular.copy(_.filter($scope.challengeDetail.prizes, function(prize, $index) {
          prize.index = $index;
          return prize.winner && prize.winner._id;
        }));
        if (prizes[0]) {
          ChallengeService.selfWinnerhNotifications({
            showId: $stateParams.showId,
            id: $stateParams.challengeId,
            prizeIndex: prizes[0].index,
          }, {}).$promise.then(function() {
            if (prizes[1]) {
              ChallengeService.selfWinnerhNotifications({
                showId: $stateParams.showId,
                id: $stateParams.challengeId,
                prizeIndex: prizes[1].index,
              }, {}).$promise.then(function() {
                growl.success('Sent notification to winner successfully');  
              });
            } else {
              growl.success('Sent notification to winner successfully');  
            }
          }).catch(function() {
            growl.error('Error when send notification to winner');
          });
        }
      });
    };
  }
})();

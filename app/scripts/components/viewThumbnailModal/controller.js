(function () {
  'use strict';
  angular.module('measureApp').controller('ViewThumbnailModalController', ViewThumbnailModalController);

  /* @ngInject */
  function ViewThumbnailModalController($uibModalInstance, thumbnailUrl) {
    this.thumbnailUrl = thumbnailUrl;

    this.okay = function() {
      $uibModalInstance.close();
    };
  }
})();

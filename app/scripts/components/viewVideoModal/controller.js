(function () {
  'use strict';
  angular.module('measureApp').controller('ViewVideoModalController', ViewVideoModalController);

  /* @ngInject */
  function ViewVideoModalController($uibModalInstance, videoDetail, $sce) {
    this.video = videoDetail;

    this.config = {
      sources: [
        {src: $sce.trustAsResourceUrl(videoDetail.originalUrl), type: 'video/mp4'},
      ],
      plugins: {
        poster: 'http://www.videogular.com/assets/images/videogular.png'
      },
      // theme: 'assets/styles/videogular.css'
    };

    this.okay = function() {
      $uibModalInstance.close();
    };
  }
})();

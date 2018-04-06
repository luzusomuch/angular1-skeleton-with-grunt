'use strict';
angular.module('measureApp').filter('html', function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
});
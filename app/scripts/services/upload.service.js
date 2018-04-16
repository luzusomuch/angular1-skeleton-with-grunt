'use strict';

angular.module('measureApp').factory('UploadService', function ($http, $q, $rootScope) {
  function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }
  return {
    checkVideoType: function(file) {
      var ext = getExtension(file.name);
      switch (ext.toLowerCase()) {
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
          return true;
      }
      return false;
    },
    checkImageType: function(file) {
      var ext = getExtension(file.name);
      switch (ext.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
        case 'png':
          return true;
      }
      return false;
    },
    uploadVideo: function (s3Info, file) {
      return $http({
        url: s3Info.uploadUrl,
        method: 'PUT',
        headers: {
          'Content-Type': $rootScope.pageSettings['VIDEO_CONTENT_TYPE'],
        },
        data: file,
      }).then(function() {
        return $q.resolve();
      }).catch(function(err) {
        return $q.reject(err);
      });
    },
    uploadThumbnail: function (s3Info, file) {
      return $http({
        url: s3Info.uploadUrl,
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        data: file,
      }).then(function() {
        return $q.resolve();
      }).catch(function(err) {
        return $q.reject(err);
      });
    },
  };
});

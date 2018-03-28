'use strict';
angular.module('measureApp').factory('ShowService', function($resource, apiUrl){
  return $resource(apiUrl + '/api/shows/:id', {}, {
    list: {
      method: 'GET',
      isArray: false,
    },
    get: {
      method: 'GET',
      params: {
        id: '@id',
      },
      isArray: false,
    },
    create: {
      method: 'POST',
      isArray: false,
    },
    update: {
      method: 'PUT',
      params: {
        id: '@id',
      },
      isArray: false,
    }
  });
});
// angular.module('measureApp').factory('ShowService', function($http, apiUrl, $cookies) {
//   var api = apiUrl + '/api/shows';
//   return {
//     list: function(params) {
//       return $http.get(api, {
//         params: params,
//         headers: {
//           Authorization: $cookies.get('token'),
//         }
//       }).then(function(resp) {
//         console.log(resp);
//       }).catch(function(err) {
//         console.log(err);
//       });
//     } 
//   }
// });
angular.module('measureApp').factory('UserService', function($resource, apiUrl){
  return $resource(apiUrl + '/v1/users/:id', {}, {
    get: {
      method: 'GET',
      params: {
        id: '@id'
      },
      isArray: false,
    }
  });
});
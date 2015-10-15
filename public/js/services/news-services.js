(function(){
    'use strict';

    angular.module('factories').factory('NewsServices', ['$http', function($http){
        return {
            getLatestNews: function(){
                return $http.get('/api/news');
            }
        }
    }])
})();
(function(){
    'use strict';

    angular.module('factories').factory('NewsServices', ['$http', function($http){
        return {
            getLatestNews: function(page){
                var pageNumber = (page) ? page : 1;
                return $http.get('/api/latestnews?page=' + pageNumber);
            }
        }
    }])
})();
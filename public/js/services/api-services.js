(function(){
    'use strict';

    angular.module('factories').factory('ApiServices', ['$http', function($http){
        return {
            getLatestNews: function(page){
                var pageNumber = (page) ? page : 1;
                return $http.get('/api/latestnews?page=' + pageNumber);
            },
            getNewsDetails: function(permalink){
                return $http.get('/api/news/' + permalink);
            },
            getLatestAchievements: function(page){
                var pageNumber = (page) ? page : 1;
                return $http.get('/api/latestachievements?page=' + pageNumber);
            },
            getAchievements: function(permalink){
                return $http.get('/api/achievements/' + permalink);
            }
        }
    }])
})();
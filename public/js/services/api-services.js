(function(){
    'use strict';

    angular.module('factories').factory('ApiServices', ['$http', function($http){
        return {
            getLatestNews: function(page){
                var pageNumber = (page) ? page : 1;
                return $http.get('/api/latest/news?page=' + pageNumber);
            },
            getNewsDetails: function(permalink){
                return $http.get('/api/news/' + permalink);
            },
            getLatestAchievements: function(page){
                var pageNumber = (page) ? page : 1;
                return $http.get('/api/latest/achievements?page=' + pageNumber);
            },
            getAchievements: function(permalink){
                return $http.get('/api/game/achievements/' + permalink);
            },
            getScreenshots: function(permalink){
                return $http.get('/api/game/screenshots/' + permalink);
            },
            getGameInfo: function(permalink){
                return $http.get('/api/game/info/' + permalink);
            }
        }
    }])
})();
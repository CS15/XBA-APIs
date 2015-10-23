(function(){
    'use strict';

    angular.module('factories').factory('ApiServices', ['$http', function($http){
        
        var apiKey = '1234567890';
        
        return {
            getLatestNews: function(page){
                var pageNumber = (page) ? page : 1;
                return $http.get('/api/latest/news?page=' + pageNumber + '&key=' + apiKey);
            },
            getNewsDetails: function(permalink){
                return $http.get('/api/news/' + permalink + '?key=' + apiKey);
            },
            getLatestAchievements: function(page){
                var pageNumber = (page) ? page : 1;
                return $http.get('/api/latest/achievements?page=' + pageNumber + '&key=' + apiKey);
            },
            getAchievements: function(permalink){
                return $http.get('/api/game/achievements?game=' + permalink + '&key=' + apiKey);
            },
            getScreenshots: function(permalink, page){

                var pageNumber = (page) ? page : 1;
                return $http.get('/api/game/screenshots?game=' + permalink + '&page=' + pageNumber + '&key=' + apiKey);
            },
            getGameInfo: function(permalink){
                return $http.get('/api/game/info?game=' + permalink + '&key=' + apiKey);
            },
            getAchievementComments: function(game, achievement){
                return $http.get('/api/game/achievement/comments?game=' + game + '&achievement=' + achievement + '&key=' + apiKey);
            },
            getGameList: function(console, letter, pageNumber) {
                 return $http.get('/api/games?console=' + console + '&letter=' + letter + '&page=' + pageNumber + '&key=' + apiKey);
            }
        }
    }]);
})();
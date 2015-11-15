(function(){
    'use strict';

    angular.module('services').factory('XaServices', ['$http', function($http){
        return {
            getLatestAchievements: function () {
                return $http.get('/api/latest/achievements');
            },
            getGameInfo: function(game) {
                return $http.get('/api/xbox/game/info?permalink=' + game);
            },
            getGameAchievements: function(game) {
                return $http.get('/api/xbox/game/achievements?permalink=' + game);
            },
            getGames: function(letter){
                var page = 1;
                return $http.get('/api/xbox/games?page=' + page + '&letter=' + letter + '&console=xbox-one');
            }
        }
    }]);
})();
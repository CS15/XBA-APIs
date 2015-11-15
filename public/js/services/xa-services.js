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
            }
        }
    }]);
})();
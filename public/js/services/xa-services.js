(function(){
    'use strict';

    angular.module('services').factory('XaServices', ['$http', function($http){
        return {
            getLatestAchievements: function () {
                return $http.get('/api/latest/achievements');
            },
            getGameInfo: function(game) {
                return $http.get('/api/game/info?game=' + game);
            },
            getGameAchievements: function(game) {
                return $http.get('/api/game/achievements?game=' + game);
            }
        }
    }]);
})();
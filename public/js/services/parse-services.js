(function(){
    'use strict';

    angular.module('services').factory('ParseServices', ['$http', function($http){
        return {
            getGameInfo: function (gameId) {
                return $http.get('/api/parse/game/info?gameId=' + gameId);
            }
        }
    }]);
})();
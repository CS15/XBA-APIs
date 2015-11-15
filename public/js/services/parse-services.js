(function(){
    'use strict';

    angular.module('services').factory('ParseServices', ['$http', '$q', function($http, $q){
        return {
            getGameInfo: function (gameId) {
                var q = $q.defer();

                $http.get('/api/parse/game/info?gameId=' + gameId)
                    .success(function(response){
                        q.resolve(response);
                    })
                    .error(function(error){
                        q.reject(error)
                    });

                return q.promise;
            },
            updateGameInfo: function (game) {
                var q = $q.defer();

                $http.post('/api/parse/game/info', game)
                    .success(function(response){
                        q.resolve(response);
                    })
                    .error(function(error){
                        q.reject(error)
                    });

                return q.promise;
            },
            uploadAchievements: function (achievements) {
                var q = $q.defer();

                $http.post('/api/parse/game/achievements', achievements)
                    .success(function(response){
                        q.resolve(response);
                    })
                    .error(function(error){
                        q.reject(error)
                    });

                return q.promise;
            }
        }
    }]);
})();
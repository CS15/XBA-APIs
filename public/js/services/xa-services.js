(function () {
    'use strict';

    angular.module('services').factory('XaServices', ['$http', '$q', function ($http, $q) {
        return {
            getLatestAchievements: function () {

                var q = $q.defer();

                $http.get('/api/xbox/latest/achievements')
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (error) {
                        q.reject(error);
                    });

                return q.promise;
            },
            getGameInfo: function (game) {

                var q = $q.defer();

                $http.get('/api/xbox/game/info?permalink=' + game)
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (error) {
                        q.reject(error);
                    });

                return q.promise;
            },
            getGameAchievements: function (game) {

                var q = $q.defer();

                $http.get('/api/xbox/game/achievements?permalink=' + game)
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (error) {
                        q.reject(error);
                    });

                return q.promise;
            },
            getGames: function (letter) {
                var page = 1;

                var q = $q.defer();

                $http.get('/api/xbox/games?page=' + page + '&letter=' + letter + '&console=xbox-one')
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (error) {
                        q.reject(error);
                    });

                return q.promise;
            }
        }
    }]);
})();
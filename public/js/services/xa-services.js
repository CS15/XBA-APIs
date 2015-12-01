(function () {
    'use strict';

    angular.module('services').factory('XaServices', ['$http', '$q', function ($http, $q) {
        return {
            getLatestAchievements: function (page) {

                var q = $q.defer();

                $http.get('/api/xbox/latest/achievements?page=' + page)
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (error) {
                        q.reject(error);
                    });

                return q.promise;
            },
            getGameInfo: function (permalink) {

                var q = $q.defer();

                $http.get('/api/xbox/game/info?permalink=' + permalink)
                    .success(function (response) {
                        q.resolve(response);
                    })
                    .error(function (error) {
                        q.reject(error);
                    });

                return q.promise;
            },
            getGameAchievements: function (permalink) {

                var q = $q.defer();

                $http.get('/api/xbox/game/achievements?permalink=' + permalink)
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
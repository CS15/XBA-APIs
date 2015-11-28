(function () {
    'use strict';

    angular.module('services').factory('GiantBombServices', ['$http', '$q', function ($http, $q) {
        return {
            getGameData: function (gameId) {
                var url = 'http://www.giantbomb.com/api/game/3030-' + gameId + '/?format=json&api_key=60a1d643b4a4ad1ad1b424a040cbf3e8b5393e41';
                return $http.get(url);
            }
        }
    }]);
})();
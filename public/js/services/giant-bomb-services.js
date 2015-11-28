(function () {
    'use strict';

    angular.module('services').factory('GiantBombServices', ['$http', '$q', function ($http, $q) {
        return {
            getGameData: function (gameId) {
                return $http.get('/api/gb?gameId=' + gameId);
            }
        }
    }]);
})();
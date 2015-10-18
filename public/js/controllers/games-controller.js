(function () {
    'use strict';

    angular.module('controllers').controller('GamesController', ['$scope', 'ApiServices',
        function ($scope, ApiServices) {
            $scope.tabTemplate = '/views/achievements-partial.html';

            ApiServices.getLatestAchievements(1).then(function (response) {
                $scope.achievements = response.data;
                $scope.selectedGame = $scope.achievements[0];
                makeNetworkCall();
            });

            $scope.update = function () {
                makeNetworkCall();
            };

            function makeNetworkCall() {
                ApiServices.getAchievements($scope.selectedGame.permalink).then(function (response) {
                    $scope.details = response.data;
                });
            }
        }]);

    angular.module('controllers').controller('LatestAchievementsController', ['$scope', 'ApiServices',
        function ($scope, ApiServices) {
            $scope.pageNumber = 1;

            ApiServices.getLatestAchievements().then(function (response) {
                $scope.achievements = response.data;
            });

            $scope.getLatestAchievements = function () {
                ApiServices.getLatestAchievements($scope.pageNumber).then(function (response) {
                    $scope.achievements = response.data;
                });
            }
        }]);
})();
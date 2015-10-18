(function () {
    'use strict';

    angular.module('controllers').controller('GamesController', ['$scope', 'ApiServices',
        function ($scope, ApiServices) {
            $scope.tabAchievementsTemplate = '/views/achievements-partial.html';
            $scope.tabScreenshotsTemplate = '/views/screenshots-partial.html';

            ApiServices.getLatestAchievements().then(function (response) {
                $scope.games = response.data;
                $scope.selectedGame = $scope.games[0];
                $scope.getAchievements();
            });

            $scope.getAchievements = function () {
                ApiServices.getAchievements($scope.selectedGame.permalink).then(function (response) {
                    $scope.achievements = response.data;
                });
            };

            $scope.getScreenshots = function () {
                ApiServices.getScreenshots($scope.selectedGame.permalink).then(function (response) {
                    $scope.screenshots = response.data;
                });
            };

            $scope.update = function(){
                $scope.getAchievements();
                $scope.getScreenshots();
            };

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
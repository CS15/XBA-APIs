(function () {
    'use strict';

    angular.module('controllers').controller('GamesController', ['$scope', 'ApiServices',
        function ($scope, ApiServices) {
            $scope.tabAchievementsTemplate = '/views/achievements-partial.html';
            $scope.tabScreenshotsTemplate = '/views/screenshots-partial.html';
            $scope.achievements = [];
            $scope.selectedGame = {};
            $scope.details = {};

            $scope.getAchievements = function () {
                ApiServices.getAchievements($scope.selectedGame.permalink).then(function (response) {
                    $scope.details = response.data;
                });
            };

            $scope.getScreenshots = function () {
                ApiServices.getScreenshots($scope.selectedGame.permalink).then(function (response) {
                    $scope.details = response.data;
                });
            };

        }]);

    angular.module('controllers').controller('AchievementsController', ['$scope', 'ApiServices', function ($scope, ApiServices) {

        ApiServices.getLatestAchievements(1).then(function (response) {
            $scope.achievements = response.data;
            $scope.selectedGame = $scope.achievements[0];
            $scope.getAchievements();
        });



    }]);

    angular.module('controllers').controller('ScreenshotsController', ['$scope', 'ApiServices', function ($scope, ApiServices) {


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
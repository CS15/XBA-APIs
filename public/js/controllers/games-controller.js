(function () {
    'use strict';

    angular.module('controllers').controller('GamesController', ['$scope', 'ApiServices',
        function ($scope, ApiServices) {
            $scope.tabs = [
                { title:'Achievements', templateUrl:'/views/achievements-partial.html' },
                { title:'Screenshots', templateUrl: '/views/screenshots-partial.html' }
            ];

            ApiServices.getLatestAchievements().then(function (response) {
                $scope.games = response.data;
                $scope.selectedGame = $scope.games[0];
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

            $scope.update = function(index){
                $scope.getAchievements();
                $scope.getScreenshots();
                console.log(index);
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
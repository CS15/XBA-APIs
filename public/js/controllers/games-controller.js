(function () {
    'use strict';

    angular.module('controllers').controller('GamesController', ['$scope', 'ApiServices',
        function ($scope, ApiServices) {
            $scope.tabs = [
                { id: 1, title:'Achievements', templateUrl:'/views/achievements-partial.html' },
                { id: 2, title:'Screenshots', templateUrl: '/views/screenshots-partial.html' }
            ];
            
            $scope.currentId = $scope.tabs[0].id;

            ApiServices.getLatestAchievements().then(function (response) {
                $scope.games = response.data;
                $scope.selectedGame = $scope.games[0];
                $scope.update(1);
            });

            function getAchievements() {
                $scope.achievements = undefined;
                
                ApiServices.getAchievements($scope.selectedGame.permalink).then(function (response) {
                    $scope.achievements = response.data;
                });
            };

            function getScreenshots() {
                $scope.screenshots = undefined;
                
                ApiServices.getScreenshots($scope.selectedGame.permalink).then(function (response) {
                    $scope.screenshots = response.data;
                });
            };

            $scope.update = function(id){
                $scope.currentId = id;
                
                switch (id) {
                    case 1:
                        getAchievements();
                        break;
                    case 2:
                        getScreenshots();
                        break;
                }
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
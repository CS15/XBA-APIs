(function () {
    'use strict';

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
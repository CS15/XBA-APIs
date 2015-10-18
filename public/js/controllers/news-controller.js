(function () {
    'use strict';

    angular.module('controllers').controller('NewsController', ['$scope', 'ApiServices',
        function ($scope, ApiServices) {

            ApiServices.getLatestNews(1).then(function (response) {
                $scope.news = response.data;
                $scope.selectedNews = $scope.news[0];
                makeNetworkCall();
            });

            $scope.update = function () {
                makeNetworkCall();
            };

            function makeNetworkCall() {
                ApiServices.getNewsDetails($scope.selectedNews.permalink).then(function (response) {
                    $scope.newsDetails = response.data;
                });
            }
        }]);

    angular.module('controllers').controller('LatestNewsController', ['$scope', 'ApiServices',
        function ($scope, ApiServices) {
            $scope.pageNumber = 1;

            ApiServices.getLatestNews().then(function (response) {
                $scope.news = response.data;
            });

            $scope.getNews = function () {
                ApiServices.getLatestNews($scope.pageNumber).then(function (response) {
                    $scope.news = response.data;
                });
            }
        }]);
})();
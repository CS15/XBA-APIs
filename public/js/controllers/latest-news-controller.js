(function(){
    'use strict';

    angular.module('controllers').controller('LatestNewsController', ['$scope', 'NewsServices',
        function($scope, NewsServices){
            $scope.pageNumber = 1;

            NewsServices.getLatestNews().then(function(response){
               $scope.news = response.data;
            });

            $scope.getNews = function(){
                NewsServices.getLatestNews($scope.pageNumber).then(function(response){
                    $scope.news = response.data;
                });
            }
    }]);
})();
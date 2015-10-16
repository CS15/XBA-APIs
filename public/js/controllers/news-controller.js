(function(){
    'use strict';

    angular.module('controllers').controller('NewsController', ['$scope', 'NewsServices',
        function($scope, NewsServices){

            NewsServices.getLatestNews(1).then(function(response){
                $scope.news = response.data;
                $scope.selectedNews = $scope.news[0];
                makeNetworkCall();
            });

            $scope.update = function(){
                makeNetworkCall();
            };

            function makeNetworkCall(){
                NewsServices.getNewsDetails($scope.selectedNews.permalink).then(function(response){
                    $scope.newsDetails = response.data;
                });
            }
    }]);
})();
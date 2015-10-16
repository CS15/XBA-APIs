(function(){
    'use strict';

    angular.module('controllers').controller('NewsController', ['$scope', 'NewsServices',
        function($scope, NewsServices){

            $scope.news = [
                {
                    title: "XBA Review: WRC 5",
                    permalink: "news-22409-XBA-Review--WRC-5"
                },
                {
                    title: "Call of Duty: Black Ops 3's Latest Campaign Vid Gets Tactical",
                    permalink: "news-22408-Call-of-Duty--Black-Ops-3-s-Latest-Campaign-Vid-Gets-Tactical"
                },
                {
                    title: "Halo 5: Guardians Now Available For Digital Pre-Order",
                    permalink: "news-22407-Halo-5--Guardians-Now-Available-For-Digital-Pre-Order"
                }
            ];

            $scope.selectedNews = $scope.news[0];

            makeNetworkCall();

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
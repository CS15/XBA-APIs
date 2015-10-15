(function(){
    'use strict';

    angular.module('controllers').controller('HomeController',['$scope', 'NewsServices',
        function($scope, NewsServices){
            NewsServices.getLatestNews().then(function(response){
               $scope.news = response.data;
            });
    }]);
})();
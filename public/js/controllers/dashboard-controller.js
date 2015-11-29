(function () {
    'use strict';

    angular.module('controllers').controller('DashboardController', ['$location', 'XaServices', function ($location, XaServices) {

        var vm = this;
        vm.currentPage = 0;

        if (!Parse.User.current()) $location.path('/');

        vm.getNext = function() {

            vm.currentPage++;

            XaServices.getLatestAchievements(vm.currentPage).then(function(response){
                vm.latestAchievements = response;
            });
        };

        vm.getPrevious = function() {

            vm.currentPage--;

            XaServices.getLatestAchievements(vm.currentPage).then(function(response){
                vm.latestAchievements = response;
            });
        };

        vm.getNext();
    }]);
})();
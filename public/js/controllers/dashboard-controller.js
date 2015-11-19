(function () {
    'use strict';

    angular.module('controllers').controller('DashboardController', ['$location', 'XaServices', function ($location, XaServices) {

        var vm = this;

        if (!Parse.User.current()) $location.path('/');
        

        XaServices.getLatestAchievements().then(function(response){
            vm.latestAchievements = response;
        });
    }]);
})();
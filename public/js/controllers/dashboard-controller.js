(function () {
    'use strict';

    angular.module('controllers').controller('DashboardController', ['$location', function ($location) {

        var vm = this;

        if (!Parse.User.current()) $location.path('/');

        vm.logout = function () {
            Parse.User.logOut();
            $location.path('/');
        };
    }]);
})();
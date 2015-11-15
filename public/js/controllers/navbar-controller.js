(function () {
    'use strict';

    angular.module('controllers').controller('NavbarController', ['$location', function ($location) {

        var vm = this;

        vm.logout = function () {
            Parse.User.logOut();
            $location.path('/');
        };
    }]);
})();
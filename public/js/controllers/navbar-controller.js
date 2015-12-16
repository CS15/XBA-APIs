(function () {
    'use strict';

    angular.module('controllers').controller('NavbarController', ['$scope', '$location', 'NavigationServices', function ($scope, $location, NavigationServices) {

        var vm = this;

        vm.isSideBarOpen = NavigationServices.getSideBarState();
        vm.displayNavigationBar = false;

        vm.logout = function () {
            Parse.User.logOut();
            $location.path('/');
        };

        vm.toggleSideBar = function () {
            NavigationServices.toggleSideBar();
        };

        $scope.$on('navigation:sidebar', function (event, data) {
            vm.isSideBarOpen = data;
        });

        $scope.$on('navigation:navbar', function (event, data) {
            vm.displayNavigationBar = data;
        });
    }]);
})();
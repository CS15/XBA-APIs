(function () {
    'use strict';

    angular.module('services').factory('NavigationServices', ['$rootScope', function ($rootScope) {
        var isSideBarOpen = false;
        var showNavigationBar = false;

        return {
            toggleSideBar: function(){
                isSideBarOpen = !isSideBarOpen;
                $rootScope.$broadcast('navigation:sidebar', isSideBarOpen);
            },
            getSideBarState: function(){
                return isSideBarOpen;
            },
            closeSideBar: function(){
                isSideBarOpen = false;
                $rootScope.$broadcast('navigation:sidebar', isSideBarOpen);
            },
            openSideBar: function(){
                isSideBarOpen = true;
                $rootScope.$broadcast('navigation:sidebar', isSideBarOpen);
            },
            displayNavigationBar: function(data){
                showNavigationBar = data;
                $rootScope.$broadcast('navigation:navbar', showNavigationBar);
            }
        }
    }]);
})();
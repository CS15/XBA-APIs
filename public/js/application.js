(function(){
    'use strict';

    Parse.initialize("ZbsmNrnAoWvV4miJsVzkr4qwSlodOyFzhYWHECbI", "PdB18ikRbBJPjuErs8b2I8kNwczL17bGceMc7qD8");

    angular.module('services', []);
    angular.module('controllers', []);

    var modules = ['services','controllers', 'ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate'];

    angular.module('app', modules)
        .config(['$routeProvider', '$locationProvider', 'cfpLoadingBarProvider',
            function($routeProvider, $locationProvider, cfpLoadingBarProvider){
                $routeProvider.when('/', {
                    templateUrl: '/views/home.html',
                    caseInsensitiveMatch: true
                }).when('/dashboard', {
                    templateUrl: '/views/dashboard.html',
                    caseInsensitiveMatch: true
                }).when('/gameinfo/:permalink', {
                    templateUrl: '/views/game-info.html',
                    caseInsensitiveMatch: true
                }).when('/browse', {
                    templateUrl: '/views/browse.html',
                    caseInsensitiveMatch: true
                }).otherwise({redirectTo: '/'});

                $locationProvider.html5Mode(true);

                cfpLoadingBarProvider.includeSpinner = false;
        }]);
})();
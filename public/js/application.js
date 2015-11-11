(function(){
    'use strict';

    angular.module('services', []);
    angular.module('controllers', []);

    var modules = ['services','controllers', 'ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate'];

    angular.module('app', modules)
        .config(['$routeProvider', '$locationProvider', 'cfpLoadingBarProvider',
            function($routeProvider, $locationProvider, cfpLoadingBarProvider){
                $routeProvider.when('/', {
                    templateUrl: '/views/home.html',
                    caseInsensitiveMatch: true
                }).otherwise({redirectTo: '/'});

                $locationProvider.html5Mode(true);

                cfpLoadingBarProvider.includeSpinner = false;
        }]);
})();
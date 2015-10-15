(function(){
    'use strict';

    angular.module('factories', []);
    angular.module('controllers', []);

    var modules = ['factories','controllers', 'ngRoute', 'angular-loading-bar'];

    angular.module('app', modules)
        .config(['$routeProvider', '$locationProvider', 'cfpLoadingBarProvider',
            function($routeProvider, $locationProvider, cfpLoadingBarProvider){
                $routeProvider.when('/', {
                    templateUrl: '/views/home.html',
                    controller: 'HomeController',
                    caseInsensitiveMatch: true
                }).otherwise({redirectTo: '/'});

                $locationProvider.html5Mode(true);

                cfpLoadingBarProvider.includeSpinner = false;
        }]);

})();
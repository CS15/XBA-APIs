(function(){
    'use strict';

    angular.module('factories', []);
    angular.module('controllers', []);

    var modules = ['factories','controllers', 'ngRoute', 'ui.bootstrap', 'angular-loading-bar'];

    angular.module('app', modules)
        .config(['$routeProvider', '$locationProvider', 'cfpLoadingBarProvider',
            function($routeProvider, $locationProvider, cfpLoadingBarProvider){
                $routeProvider.when('/', {
                    templateUrl: '/views/home.html',
                    caseInsensitiveMatch: true
                }).when('/news', {
                    templateUrl: '/views/news.html',
                    caseInsensitiveMatch: true
                }).when('/latestnews', {
                    templateUrl: '/views/latest-news.html',
                    caseInsensitiveMatch: true
                }).when('/latestachievements', {
                    templateUrl: '/views/latest-achievements.html',
                    caseInsensitiveMatch: true
                }).when('/games', {
                    templateUrl: '/views/games.html',
                    controller: 'GamesController',
                    caseInsensitiveMatch: true
                }).otherwise({redirectTo: '/'});

                $locationProvider.html5Mode(true);

                cfpLoadingBarProvider.includeSpinner = false;
        }]);

})();
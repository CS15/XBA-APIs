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
                }).when('/news', {
                    templateUrl: '/views/news.html',
                    controller: 'NewsController',
                    caseInsensitiveMatch: true
                }).when('/latestnews', {
                    templateUrl: '/views/latest-news.html',
                    controller: 'LatestNewsController',
                    caseInsensitiveMatch: true
                }).when('/latestachievements', {
                    templateUrl: '/views/latest-achievements.html',
                    controller: 'LatestAchievementsController',
                    caseInsensitiveMatch: true
                }).otherwise({redirectTo: '/'});

                $locationProvider.html5Mode(true);

                cfpLoadingBarProvider.includeSpinner = false;
        }]);

})();
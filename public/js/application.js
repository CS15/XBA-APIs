(function() {
    'use strict';

    Parse.initialize("ZbsmNrnAoWvV4miJsVzkr4qwSlodOyFzhYWHECbI", "PdB18ikRbBJPjuErs8b2I8kNwczL17bGceMc7qD8");

    angular.module('services', []);
    angular.module('controllers', []);
    angular.module('filters', []);

    var modules = ['services', 'controllers', 'filters', 'ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate'];

    angular.module('app', modules)
        .config(['$routeProvider', '$locationProvider', 'cfpLoadingBarProvider',
            function($routeProvider, $locationProvider, cfpLoadingBarProvider) {
                $routeProvider.when('/', {
                    templateUrl: '/views/home.html',
                    caseInsensitiveMatch: true
                }).when('/dashboard', {
                    templateUrl: '/views/dashboard.html',
                    caseInsensitiveMatch: true
                }).when('/game-info/:permalink', {
                    templateUrl: '/views/game-info.html',
                    caseInsensitiveMatch: true
                }).when('/browse', {
                    templateUrl: '/views/browse.html',
                    caseInsensitiveMatch: true
                }).when('/no-access', {
                    templateUrl: '/views/no-access.html',
                    caseInsensitiveMatch: true
                }).otherwise({
                    redirectTo: '/'
                });

                $locationProvider.html5Mode(true);

                cfpLoadingBarProvider.includeSpinner = false;
            }

        ]).run(['$rootScope', '$location', 'NavigationServices',
            function($rootScope, $location, NavigationServices) {

                $rootScope.$on('$routeChangeStart', function(event, next, current) {

                    if ($location.url() === '/' || $location.url() === '/no-access')
                        NavigationServices.displayNavigationBar(false);
                    else
                        NavigationServices.displayNavigationBar(true);

                    if (Parse.User.current()) {
                        var query = (new Parse.Query(Parse.Role));
                        query.equalTo("name", "Admin");
                        query.equalTo("users", Parse.User.current());
                        query.first().then(function(adminRole) {
                            if (!adminRole) {
                                $location.path('/no-access');
                            }
                        });
                    } else {
                        $location.path('/');
                    }

                    NavigationServices.closeSideBar()
                });
            }
        ]);
})();
(function() {
    'use strict';

    angular.module('controllers').controller('GameInfoController', ['$location', '$routeParams', 'XaServices', 'ParseServices',
        function($location, $routeParams, XaServices, ParseServices) {

            if (!Parse.User.current()) $location.path('/');

            var gamePermalink = $routeParams.permalink;

            var vm = this;

            function getGameInfoFromXA(permalink, callback) {
                XaServices.getGameInfo(permalink)
                    .then(function(response) {
                        vm.gameInfo = response;
                        
                        callback(vm.gameInfo.gameId);
                    }, function(error) {
                        console.log(error);
                    });
            };

            function getGameInfoFromParse(parseGameId) {
                ParseServices.getGameInformation(parseGameId)
                    .then(function(response) {
                        if (response.length > 0) {
                            vm.inParse = true;
                            vm.parseObjectId = response[0].objectId;
                            vm.gameInfo.bannerImageUrl = response[0].bannerImageUrl
                        }

                        vm.gameInfoChecked = true;
                    }, function(error) {
                        console.log(error);
                    });
            };

            function getGameAchievementsFromXA(permalink, callback) {
                XaServices.getGameAchievements(gamePermalink)
                    .then(function(response) {
                        vm.achievements = response;
                        
                        callback();
                    }, function(error) {
                        console.log(error);
                    });
            };

            function getGameAchievementsFromParse(parseGameId) {
                ParseServices.getGameAchievements(parseGameId).then(function(response) {
                    vm.parseAchievements = response;

                    if (response.length > 0) {
                        angular.forEach(vm.achievements, function(value, key) {

                            for (var i in vm.parseAchievements) {
                                if (value.achievementId === response[i].achievementId) {
                                    value.inParse = true;
                                }
                            }
                        });
                    }

                    vm.gameAchievementsChecked = true;
                }, function(error) {
                    console.log(error);
                });
            };

            function init() {
                
                getGameInfoFromXA(gamePermalink, function(gameId){
                    getGameInfoFromParse(gameId);
                    
                    getGameAchievementsFromXA(gamePermalink, function(){
                        getGameAchievementsFromParse(gameId);
                    });
                });
                
            };

            vm.addGameInfoToParse = function(game) {
                ParseServices.addGameInfoToParse(game).then(function(response) {
                    init();
                });
            };

            vm.uploadAllAchievements = function() {
                if (vm.achievements.length > 0) {

                    angular.forEach(vm.achievements, function(value, key) {
                        value.game = vm.parseObjectId;
                        value.gameId = vm.gameInfo.gameId;
                    });

                    ParseServices.addAchievementsToParse(vm.achievements).then(function(response) {
                        init();
                    }, function(error) {
                        alert('Error');
                    });
                }
            };

            init();
        }
    ]);
})();
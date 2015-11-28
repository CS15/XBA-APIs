(function() {
    'use strict';

    angular.module('controllers').controller('GameInfoController', ['$location', '$routeParams', 'XaServices', 'ParseServices', 'GiantBombServices',
        function($location, $routeParams, XaServices, ParseServices, GiantBombServices) {

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
            }

            function getGameInfoFromParse(parseGameId) {
                ParseServices.getGameInformation(parseGameId)
                    .then(function(response) {
                        if (response.length > 0) {
                            vm.inParse = true;
                            vm.parseObjectId = response[0].objectId;
                            vm.gameInfo.bannerImageUrl = response[0].bannerImageUrl;
                            vm.gameInfo.description = response[0].description;
                            vm.gameInfo.coverImageUrl = response[0].coverImageUrl;
                        }

                        vm.gameInfoChecked = true;
                    }, function(error) {
                        console.log(error);
                    });
            }

            function getGameAchievementsFromXA(permalink, callback) {
                XaServices.getGameAchievements(gamePermalink)
                    .then(function(response) {
                        vm.achievements = response;
                        
                        callback();
                    }, function(error) {
                        console.log(error);
                    });
            }

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
            }

            function init() {
                
                getGameInfoFromXA(gamePermalink, function(gameId){
                    getGameInfoFromParse(gameId);
                    
                    getGameAchievementsFromXA(gamePermalink, function(){
                        getGameAchievementsFromParse(gameId);
                    });
                });
                
            }

            function parseGameDescription(text) {
                return text ? String(text).replace(/<[^>]+>/gm, '') : '';
            }

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
                        console.log(error);

                        alert('Error');
                    });
                }
            };

            vm.getGiantBombData = function() {

                GiantBombServices.getGameData(vm.gameInfo.gbGameId)
                    .then(function(response) {
                        //vm.gameInfo.description = parseGameDescription(response.data.results.description).replace('Overview', '').trim();
                        vm.gameInfo.description = response.data.results.description;
                        vm.gameInfo.coverImageUrl = response.data.results.image.small_url;

                        vm.doneGettingGbData = true;
                    }, function(error) {
                        alert('Error');
                    });
            };

            init();
        }
    ]);
})();
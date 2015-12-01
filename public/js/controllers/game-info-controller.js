(function () {
    'use strict';

    angular.module('controllers').controller('GameInfoController', ['$location', '$routeParams', 'XaServices', 'ParseServices', 'GiantBombServices',
        function ($location, $routeParams, XaServices, ParseServices, GiantBombServices) {

            var permalink = $routeParams.permalink;

            if (!Parse.User.current()) $location.path('/');

            var vm = this;
            vm.gameXA = {};
            vm.gameParse = {};
            vm.show = false;

            vm.isGameInParse = function () {
                return vm.gameXA.gameId === vm.gameParse.gameId;
            };

            vm.isGameAchievementsUpToDate = function () {
                return vm.gameXA.achievements.length === vm.gameParse.achievements.length;
            };

            vm.init = function () {

                XaServices.getGameInfo(permalink).then(function (data) {
                    vm.gameXA = data;

                    XaServices.getGameAchievements(permalink).then(function (data) {
                        vm.gameXA.achievements = data;

                        ParseServices.getGameInformation(vm.gameXA.gameId).then(function (data) {

                            if (data) {
                                vm.gameParse = data;
                                vm.gameXA.gbGameId = vm.gameParse.gbGameId;
                                vm.gameXA.artworkUrl = vm.gameParse.artworkUrl;
                                vm.gameXA.description = vm.gameParse.description;
                                vm.gameXA.bannerUrl = vm.gameParse.bannerUrl;

                                ParseServices.getGameAchievements(vm.gameXA.gameId).then(function (data) {
                                    vm.gameParse.achievements = data;

                                    angular.forEach(vm.gameXA.achievements, function (value, key) {

                                        for (var i in vm.gameParse.achievements) {
                                            if (value.achievementId === vm.gameParse.achievements[i].achievementId) {
                                                value.inParse = true;
                                            }
                                        }
                                    });

                                    vm.show = true;
                                });
                            } else {
                                vm.show = true;
                            }
                        });
                    });
                });
            };

            vm.getGiantBombData = function () {
                GiantBombServices.getGameData(vm.gameParse.gbGameId)
                    .then(function (response) {
                        vm.gameXA.gbGameId = vm.gameParse.gbGameId;
                        vm.gameXA.description = response.data.results.deck.trim();
                        vm.gameXA.artworkUrl = response.data.results.image.small_url;

                        vm.doneGettingGbData = true;
                    });
            };

            vm.addGameInfoToParse = function (game) {
                ParseServices.addGameInfoToParse(game).then(function (data) {
                    vm.init();
                });
            };

             vm.updateAchievements = function(game) {
                 if (game.achievements.length > 0) {

                     angular.forEach(game.achievements, function(value, key) {
                         value.parseGameId = vm.gameParse.objectId;
                         value.gameId = vm.gameXA.gameId;
                     });

                     ParseServices.addAchievementsToParse(game.achievements).then(function(data) {
                         vm.init();
                     });
                 }
             };

            vm.init();
        }
    ]);
})();
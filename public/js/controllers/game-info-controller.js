(function() {
    'use strict';

    angular.module('controllers').controller('GameInfoController', ['$location', '$routeParams', 'XaServices', 'ParseServices', 'GiantBombServices',
        function($location, $routeParams, XaServices, ParseServices, GiantBombServices) {
            
            var permalink = $routeParams.permalink;

            if (!Parse.User.current()) $location.path('/');

            var vm = this;
            vm.gameXA = {};
            vm.gameParse = {};
            vm.show = false;
            
            vm.isGameInParse = function(){
                return vm.gameXA.gameId === vm.gameParse.gameId;
            };
            
            vm.isGameAchievementsUpToDate = function(){
                return vm.gameXA.achievements.length === vm.gameParse.achievements.length;
            };
            
            vm.init = function(){
                  XaServices.getGameInfo(permalink).then(function(data){
                   vm.gameXA = data;
                   
                   XaServices.getGameAchievements(permalink).then(function(data){
                       vm.gameXA.achievements = data;
                       
                       ParseServices.getGameInformation(vm.gameXA.gameId).then(function(data){
                           
                           if (data) {
                                vm.gameParse = data;
    
                                ParseServices.getGameAchievements(vm.gameXA.gameId).then(function(data){
                                  vm.gameParse.achievements = data;
                                       
                                    angular.forEach(vm.gameXA.achievements, function(value, key) {
                                
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
            
            vm.init();



            // vm.addGameInfoToParse = function(game) {
            //     ParseServices.addGameInfoToParse(game).then(function(response) {
            //         init();
            //     });
            // };

            // vm.uploadAllAchievements = function() {
            //     if (vm.achievements.length > 0) {

            //         angular.forEach(vm.achievements, function(value, key) {
            //             value.game = vm.parseObjectId;
            //             value.gameId = vm.gameInfo.gameId;
            //         });

            //         ParseServices.addAchievementsToParse(vm.achievements).then(function(response) {
            //             init();
            //         }, function(error) {
            //             console.log(error);

            //             alert('Error');
            //         });
            //     }
            // };

            // vm.getGiantBombData = function() {

            //     GiantBombServices.getGameData(vm.gameInfo.gbGameId)
            //         .then(function(response) {
            //             vm.gameInfo.description = response.data.results.deck.trim();
            //             vm.gameInfo.coverImageUrl = response.data.results.image.small_url;

            //             vm.doneGettingGbData = true;
            //         }, function(error) {
            //             alert('Error');
            //         });
            // };

            // init();
        }
    ]);
})();